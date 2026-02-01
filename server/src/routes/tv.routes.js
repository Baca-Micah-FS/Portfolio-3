const express = require("express");
const router = express.Router();

const trendingTvController = require("../controllers/tv.trending.controller");
const searchTvController = require("../controllers/tv.search.controller");

router.get("/trending", trendingTvController);
router.get("/search", searchTvController);

module.exports = router;
