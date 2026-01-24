const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const COOKIE_NAME = "auth_token";

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// redirect on cancel helper
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

  // front end redirect on cancle
  if (error) {
    return res.redirect(
      getFrontendRedirect("/", { auth: "failed", reason: error })
    );
  }

  if (!code) {
    return res.redirect(
      getFrontendRedirect("/", {
        auth: "failed",
        reason: "missing_code",
      })
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

    const { access_token, refresh_token } = tokenRes.data;

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
      jwtToken: appJwt,
      lastLoginAt: new Date(),
    };

    if (refresh_token) update.refreshToken = refresh_token;

    const user = await User.findOneAndUpdate(
      { googleUserId: id },
      { $set: update },
      { upsert: true, new: true }
    );

    req.session.userId = user._id;

    // redirect to frontend after login
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(frontendUrl);
  } catch (err) {
    console.error("Callback error:", err.response?.data || err.message);

    // on cancel redirect user back to frontend login
    return res.redirect(
      getFrontendRedirect("/", {
        auth: "failed",
        reason: "callback_failed",
      })
    );
  }
};

// frontend send user to login screen or not
const session = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(200).json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      googleUserId: decoded.userId,
      jwtToken: token,
    }).select("googleUserId email displayName picture");

    if (!user) return res.status(200).json({ loggedIn: false });

    return res.status(200).json({ loggedIn: true, user });
  } catch (err) {
    return res.status(200).json({ loggedIn: false });
  }
};

const getCurrentUser = async (req, res) => {
  console.log("session", req.sessionID);
  if (!req.session.userId) {
    return res.status(401).json({ user: null });
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "email displayName picture -_id"
    );
    if (!user) {
      return res.status(401).json({ user: null });
    }
    res.json({ user });
  } catch (error) {
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

module.exports = { login, callback, session, logout, getCurrentUser };
