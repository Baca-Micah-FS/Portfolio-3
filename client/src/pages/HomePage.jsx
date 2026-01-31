import { useState, useEffect } from "react";
import axios from "axios";
import TrendingCard from "../components/TrendingCard";
import toast from "react-hot-toast";

const HomePage = () => {
  const [moviesTrending, setMoviesTrending] = useState([]);
  const [tvTrending, setTvTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tvAPI = "http://localhost:5050/api/v1/tv/trending";
    const moviesAPI = "http://localhost:5050/api/v1/movies/trending";
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError("");

        const tvRes = await axios.get(tvAPI, { withCredentials: true });
        const movieRes = await axios.get(moviesAPI, { withCredentials: true });

        setTvTrending(tvRes.data.results);
        console.log(tvRes.data);
        setMoviesTrending(movieRes.data.results);
      } catch (error) {
        setError("Failed to load trending");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSaveTrendingMovie = async (movie) => {
    try {
      const res = await fetch("http://localhost:5050/api/v1/watchlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Save failed:", data);
        toast.error(data.error || "Failed to save");
        return;
      }

      if (data.message === "Already in watchlist") {
        toast("Already in your watchlist", { icon: "📌" });
      } else {
        toast.success("Added to watchlist!");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error saving movie");
    }
  };

  return (
    <>
      <h1>Trending Movies</h1>
      <div className="trendingRow">
        {moviesTrending.map((movie) => (
          <TrendingCard
            key={movie.id}
            movie={movie}
            onSave={handleSaveTrendingMovie}
          />
        ))}
      </div>
    </>
  );
};
export default HomePage;
