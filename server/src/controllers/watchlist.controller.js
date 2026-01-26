const User = require("../models/User");

const requireSessionUser = (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not logged in" });
    return null;
  }
  return req.session.userId;
};

const getWatchlist = async (req, res) => {
  const userId = requireSessionUser(req, res);
  if (!userId) return;

  try {
    const user = await User.findById(userId).select("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    // return newest first
    const list = [...(user.watchlist || [])].sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );

    return res.status(200).json({ watchlist: list });
  } catch (err) {
    console.error("Get watchlist failed:", err.message);
    return res.status(500).json({ error: "Failed to fetch watchlist" });
  }
};

const addToWatchlist = async (req, res) => {
  const userId = requireSessionUser(req, res);
  if (!userId) return;

  const { tmdbId, title, poster_path, overview, release_date, vote_average } =
    req.body;

  if (!tmdbId || !title) {
    return res.status(400).json({
      error: "tmdbId and title are required",
    });
  }

  try {
    const user = await User.findById(userId).select("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    // prevent duplicates
    const alreadySaved = (user.watchlist || []).some(
      (m) => String(m.tmdbId) === String(tmdbId)
    );

    if (alreadySaved) {
      return res.status(200).json({
        success: true,
        message: "Already in watchlist",
        watchlist: user.watchlist,
      });
    }

    user.watchlist.push({
      tmdbId,
      title,
      poster_path,
      overview,
      release_date,
      vote_average,
      addedAt: new Date(),
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (err) {
    console.error("Add to watchlist failed:", err.message);
    return res.status(500).json({ error: "Failed to add to watchlist" });
  }
};

const removeFromWatchlist = async (req, res) => {
  const userId = requireSessionUser(req, res);
  if (!userId) return;

  const { tmdbId } = req.params;

  try {
    const user = await User.findById(userId).select("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    const before = user.watchlist.length;

    user.watchlist = user.watchlist.filter(
      (m) => String(m.tmdbId) !== String(tmdbId)
    );

    const after = user.watchlist.length;

    if (before === after) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (err) {
    console.error("Remove from watchlist failed:", err.message);
    return res.status(500).json({ error: "Failed to remove from watchlist" });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
