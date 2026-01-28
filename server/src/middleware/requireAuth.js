const User = require("../models/User");

const refresh = async (req, res, next) => {
  console.log("Testing", req.testing, req.session.userId);
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const user = await User.findById(req.session.userId).select(
      "refreshToken accessTokenExpiresAt"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("refresh?");
    if (!user.refreshToken) {
      return res.status(400).json({
        error: "No refresh token stored. Re-login with Google to get one.",
      });
    }

    const differenceInDate = user.accessTokenExpiresAt.getTime() - Date.now();

    const minutes = Math.floor(differenceInDate / (1000 * 60));
    console.log(minutes);

    if (minutes < 5) {
      const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: user.refreshToken,
        grant_type: "refresh_token",
      });

      const tokenRes = await axios.post(GOOGLE_TOKEN_URL, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, expires_in } = tokenRes.data;

      const accessTokenExpiresAt = expires_in
        ? new Date(Date.now() + expires_in * 1000)
        : null;

      await User.findByIdAndUpdate(req.session.userId, {
        $set: {
          accessToken: access_token,
          accessTokenExpiresAt,
          lastLoginAt: new Date(),
        },
      });
    }
    req.minutesTilExpiresIn = minutes;
    next();
  } catch (err) {
    console.error("Refresh error:", err.response?.data || err.message);
    next();
  }
};

const testMiddleware = async (req, res, next) => {
  console.log("Session", req.session.userId);
  req.testing = true;
  next();
};

module.exports = {
  refresh,
  testMiddleware,
};
