// Added: require axios
const axios = require("axios");

// Movie search controller
const movieController = async (req, res) => {
  // Get search term from query string
  const query = req.query.query;

  // If no search term, respond with error
  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    // Build TMDB API URL
    const tmdbUrl = "https://api.themoviedb.org/3/search/movie";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY, // your TMDB key from .env
        query: query,
      },
    });

    // Send back the results array
    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB search failed", error.message);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
};

module.exports = movieController;
