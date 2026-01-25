const axios = require("axios");

const movieController = async (req, res) => {
  // Get search term from query string
  const query = req.query.query;

  // If no search typed
  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    // Build TMDB API URL
    const tmdbUrl = "https://api.themoviedb.org/3/search/movie";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
      },
    });

    // Send back the results array of search
    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB search failed", error.message);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
};

module.exports = movieController;
