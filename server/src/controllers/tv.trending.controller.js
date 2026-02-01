const axios = require("axios");

const trendingTvController = async (req, res) => {
  try {
    const tmdbUrl = "https://api.themoviedb.org/3/trending/tv/day";

    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });

    return res.status(200).json({ results: response.data.results });
  } catch (error) {
    console.error("TMDB trending TV failed", error.message);
    return res.status(500).json({ error: "Failed to fetch trending TV" });
  }
};

module.exports = trendingTvController;
