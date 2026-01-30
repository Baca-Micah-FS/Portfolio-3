const express = require("express");
const router = express.Router();
const movieRoutes = require("./movies.routes");
const watchlistRoutes = require("./watchlist.routes");
const tvRoutes = require("../routes/tv.routes");

router.use("/watchlist", watchlistRoutes);

const authRoutes = require("./auth.routes");

router.use("/auth", authRoutes);

router.use("/movies", movieRoutes);

router.use("/tv", tvRoutes);

module.exports = router;
