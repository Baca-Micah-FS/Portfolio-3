const express = require("express");
const router = express.Router();

const trendingTvController = require("../controllers/tv.trending.controller");

router.get("/trending", trendingTvController);

module.exports = router;
