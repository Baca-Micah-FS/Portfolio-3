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

  console.log("🔥 addToWatchlist HIT", new Date().toISOString());

  const {
    tmdbId,
    mediaType,
    title,
    poster_path,
    overview,
    release_date,
    vote_average,
  } = req.body;

  if (tmdbId === undefined || tmdbId === null || !title || !mediaType) {
    return res.status(400).json({
      error: "tmdbId, title, and mediaType are required",
    });
  }

  if (!["movie", "tv"].includes(mediaType)) {
    return res.status(400).json({
      error: 'mediaType must be "movie" or "tv"',
    });
  }

  const incomingId = Number(tmdbId);
  if (Number.isNaN(incomingId)) {
    return res.status(400).json({
      error: "tmdbId must be a number",
    });
  }

  try {
    const user = await User.findById(userId).select("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Normalize stored items that might be missing mediaType (older saves)
    const alreadySaved = (user.watchlist || []).some((m) => {
      const storedId = Number(m.tmdbId);
      const storedType = String(m.mediaType || "movie"); // default old items to movie
      return storedId === incomingId && storedType === mediaType;
    });

    if (alreadySaved) {
      return res.status(200).json({
        success: true,
        message: "Already in watchlist",
        watchlist: user.watchlist,
      });
    }

    user.watchlist.push({
      tmdbId: incomingId, // store normalized number
      mediaType,
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
  const { mediaType } = req.query;

  console.log(
    "🔥 removeFromWatchlist HIT",
    new Date().toISOString(),
    req.params,
    req.query
  );

  const incomingId = Number(tmdbId);
  if (Number.isNaN(incomingId)) {
    return res.status(400).json({ error: "tmdbId must be a number" });
  }

  const incomingType = mediaType ? String(mediaType) : null;

  try {
    const user = await User.findById(userId).select("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = user.watchlist || [];

    const idx = list.findIndex((m) => {
      const storedId = Number(m.tmdbId);
      const storedType = String(m.mediaType || "movie"); // old items default to movie

      if (incomingType) {
        return storedId === incomingId && storedType === incomingType;
      }
      return storedId === incomingId;
    });

    if (idx === -1) {
      return res.status(404).json({ error: "Item not found in watchlist" });
    }

    // Remove exactly one matching item (important if duplicates already exist)
    list.splice(idx, 1);
    user.watchlist = list;

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
