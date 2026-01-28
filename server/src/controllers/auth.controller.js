const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const getFrontendRedirect = (path = "/", params = {}) => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";
  const url = new URL(path, base);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const login = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

const callback = async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(
      getFrontendRedirect("/", { auth: "failed", reason: error })
    );
  }

  if (!code) {
    return res.redirect(
      getFrontendRedirect("/", { auth: "failed", reason: "missing_code" })
    );
  }

  try {
    const tokenBody = new URLSearchParams({
      code: String(code),
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const tokenRes = await axios.post(GOOGLE_TOKEN_URL, tokenBody.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    const accessTokenExpiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000)
      : null;

    const meRes = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, email, name, picture } = meRes.data;

    const appJwt = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    const update = {
      googleUserId: id,
      email,
      displayName: name,
      picture,
      accessToken: access_token,
      accessTokenExpiresAt,
      jwtToken: appJwt,
      lastLoginAt: new Date(),
    };

    // store refrsh token
    if (refresh_token) update.refreshToken = refresh_token;

    const user = await User.findOneAndUpdate(
      { googleUserId: id },
      { $set: update },
      { upsert: true, new: true }
    );

    req.session.userId = user._id;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect(
          getFrontendRedirect("/", {
            auth: "failed",
            reason: "session_save_failed",
          })
        );
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(frontendUrl);
    });
  } catch (err) {
    console.error("Callback error:", err.response?.data || err.message);
    return res.redirect(
      getFrontendRedirect("/", { auth: "failed", reason: "callback_failed" })
    );
  }
};

const session = async (req, res) => {
  console.log("getting current user", req.minutesTilExpiresIn);
  try {
    if (!req.session?.userId) {
      return res.status(200).json({ loggedIn: false });
    }

    const user = await User.findById(req.session.userId).select(
      "email displayName picture"
    );

    if (!user) return res.status(200).json({ loggedIn: false });

    return res.status(200).json({ loggedIn: true, user });
  } catch {
    return res.status(200).json({ loggedIn: false });
  }
};

const getCurrentUser = async (req, res) => {
  console.log("getting current user");
  if (!req.session.userId) {
    return res.status(401).json({ user: null });
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "email displayName picture -_id"
    );
    if (!user) return res.status(401).json({ user: null });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const logout = async (req, res) => {
  req.session.destroy(() => {
    res
      .status(200)
      .json({ success: true, message: "Logged out of the system" });
  });
};

// Refresh Google access token using saved refreshToken
// const refresh = async (req, res) => {
//   if (!req.session?.userId) {
//     return res.status(401).json({ error: "Not logged in" });
//   }

//   try {
//     const user = await User.findById(req.session.userId).select("refreshToken");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     console.log("refresh?");
//     if (!user.refreshToken) {
//       return res.status(400).json({
//         error: "No refresh token stored. Re-login with Google to get one.",
//       });
//     }

//     const body = new URLSearchParams({
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       refresh_token: user.refreshToken,
//       grant_type: "refresh_token",
//     });

//     const tokenRes = await axios.post(GOOGLE_TOKEN_URL, body.toString(), {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     const { access_token, expires_in } = tokenRes.data;

//     const accessTokenExpiresAt = expires_in
//       ? new Date(Date.now() + expires_in * 1000)
//       : null;

//     await User.findByIdAndUpdate(req.session.userId, {
//       $set: {
//         accessToken: access_token,
//         accessTokenExpiresAt,
//         lastLoginAt: new Date(),
//       },
//     });

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Refresh error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Failed to refresh access token" });
//   }
// };

// tru false route for access token
const tokenStatus = async (req, res) => {
  try {
    if (!req.session?.userId) return res.status(200).json({ ok: false });

    const user = await User.findById(req.session.userId).select(
      "accessToken accessTokenExpiresAt refreshToken"
    );

    if (!user || !user.accessToken) return res.status(200).json({ ok: false });

    const expired =
      user.accessTokenExpiresAt &&
      new Date(user.accessTokenExpiresAt).getTime() <= Date.now();

    return res.status(200).json({
      ok: !expired,
      expired: !!expired,
      canRefresh: !!user.refreshToken,
    });
  } catch {
    return res.status(200).json({ ok: false });
  }
};

module.exports = {
  login,
  callback,
  session,
  logout,
  getCurrentUser,
  // refresh,
  tokenStatus,
};
