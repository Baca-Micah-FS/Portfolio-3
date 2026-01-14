const axios = require("axios");
const User = require("../models/User");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const login = async (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    // comes back as a query param called code
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  res.redirect(authUrl);
  // res.status(200).json({ authUrl, message: "login", success: true });
};

const callback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res
      .status(500)
      .json({ message: "The callback has no auth code", success: false });
  }

  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = tokenResponse.data;
    console.log("access token:", access_token);

    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { id, email, name, picture } = userInfoResponse.data;
    console.log("Email", email);
    const user = await User.create({
      googleUserId: id,
      email,
      name,
      picture,
      access_token,
    });
    res.status(200).json({ user, success: true });
    console.log("User data", id, email, name, picture);
  } catch (error) {
    console.log("error");
    res
      .status(404)
      .json({ message: "The callback has an error", success: false });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ message: "logout", success: true });
};

module.exports = { login, callback, logout };
