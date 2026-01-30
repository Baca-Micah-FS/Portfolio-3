const axios = require("axios");

const trendingMoviesController = async (req, res) => {
  try {
    // You can choose "day" or "week". I recommend "day" for Home.
    const tmdbUrl = "https://api.themoviedb.org/3/trending/movie/day";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });

    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB trending failed", error.message);
    return res.status(500).json({ error: "Failed to fetch trending movies" });
  }
};

module.exports = trendingMoviesController;
