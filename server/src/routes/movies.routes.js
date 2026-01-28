const express = require("express");

const router = express.Router();

const movieController = require("../controllers/movie.controller");
const middleWare = require("../middleware/requireAuth");

router.get("/trending", movieController);

router.get("/search", movieController);

module.exports = router;
