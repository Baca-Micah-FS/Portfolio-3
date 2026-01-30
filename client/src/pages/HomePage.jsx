import { useState, useEffect } from "react";
import axios from "axios";
import TrendingCard from "../components/TrendingCard";

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

  return (
    <>
      <h1>Trending Movies</h1>
      <div className="trendingRow">
        <TrendingCard />
      </div>
    </>
  );
};
export default HomePage;
