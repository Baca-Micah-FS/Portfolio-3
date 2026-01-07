const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const spotifyRoutes = require("./spotify.routes");

router.use("/auth", authRoutes);
router.use("/spotify", spotifyRoutes);

module.exports = router;
