const axios = require("axios");

const searchTvController = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const tmdbUrl = "https://api.themoviedb.org/3/search/tv";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });

    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB TV search failed", error.message);
    return res.status(500).json({ error: "Failed to fetch TV shows" });
  }
};

module.exports = searchTvController;
