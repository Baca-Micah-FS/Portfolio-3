const express = require("express");
const router = express.Router();

const searchMoviesController = require("../controllers/movies.search.controller");
const trendingMoviesController = require("../controllers/movies.trending.controller");

// const middleWare = require("../middleware/requireAuth");

router.get("/trending", trendingMoviesController);
router.get("/search", searchMoviesController);

module.exports = router;
