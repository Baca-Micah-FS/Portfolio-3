const express = require("express");
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlist.controller");

router.get("/", getWatchlist);

router.post("/", addToWatchlist);

router.delete("/:tmdbId", removeFromWatchlist);

module.exports = router;
