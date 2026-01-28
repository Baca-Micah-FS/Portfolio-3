const express = require("express");
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlist.controller");

const middleWare = require("../middleware/requireAuth");

// Protect ALL watchlist routes
router.get("/", middleWare.refresh, getWatchlist);
router.post("/", middleWare.refresh, addToWatchlist);
router.delete("/:tmdbId", middleWare.refresh, removeFromWatchlist);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   getWatchlist,
//   addToWatchlist,
//   removeFromWatchlist,
// } = require("../controllers/watchlist.controller");
// const middleWare = require("../middleware/requireAuth");

// router.get("/", middleWare.refresh, getWatchlist);

// router.post("/", addToWatchlist);

// router.delete("/:tmdbId", removeFromWatchlist);

// module.exports = router;
