const axios = require("axios");

const searchMoviesController = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const tmdbUrl = "https://api.themoviedb.org/3/search/movie";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });

    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB search failed", error.message);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
};

module.exports = searchMoviesController;
