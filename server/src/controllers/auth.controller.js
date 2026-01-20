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
    // deploy configurations
    secure: isProd,
    // needed for cross deploy. Backend render.com and frontend Netlify.. Local dev vs prod
    sameSite: isProd ? "none" : "lax",
    // sets login life
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const login = (req, res) => {
  // builds google o auth
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });

  //after login redirect tocall back with auth code
  return res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

const callback = async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res
      .status(401)
      .json({ success: false, message: "OAuth error", error });
  }
  if (!code) {
    return res
      .status(400)
      .json({ success: false, message: "Missing auth code" });
  }

  try {
    // code exchange for access token after then fetch user's profile info
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

    // get user info
    const meRes = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, email, name, picture } = meRes.data;

    // wrap O-Auth in JWT
    const appJwt = jwt.sign({ userId: id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // persist user + JWT in DB
    const update = {
      googleUserId: id,
      email,
      displayName: name,
      picture,
      accessToken: access_token,
      jwtToken: appJwt,
      lastLoginAt: new Date(),
    };

    // only store refresh_token if Google returns
    if (refresh_token) update.refreshToken = refresh_token;

    await User.findOneAndUpdate(
      { googleUserId: id },
      { $set: update },
      { upsert: true, new: true }
    );

    // set cookie so frontend can stay logged in
    res.cookie(COOKIE_NAME, appJwt, cookieOptions());

    // redirect to frontend after login
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(frontendUrl);
  } catch (err) {
    console.error("Callback error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Callback failed" });
  }
};

// frontend send user to login screen or not
const session = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(200).json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // validate token exists in DB (JWT persistence validation)
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

const logout = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    // clear cookie
    res.clearCookie(COOKIE_NAME, cookieOptions());

    // remove persisted jwt from db
    if (token) {
      await User.updateOne({ jwtToken: token }, { $set: { jwtToken: null } });
    }

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(200).json({ success: true, message: "Logged out" });
  }
};

module.exports = { login, callback, session, logout };
