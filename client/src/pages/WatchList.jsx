import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

const WatchListPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5050/api/v1/watchlist", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Watchlist fetch failed:", data);
        setWatchlist([]);
        return;
      }

      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error("Watchlist network error:", err);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (tmdbId) => {
    try {
      const res = await fetch(
        `http://localhost:5050/api/v1/watchlist/${tmdbId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Remove failed:", data);
        alert(data.error || "Failed to remove movie");
        return;
      }

      // update UI immediately
      setWatchlist((prev) =>
        prev.filter((m) => String(m.tmdbId) !== String(tmdbId))
      );
      toast.success("Removed from watchlist");
    } catch (err) {
      console.error("Remove network error:", err);
      alert("Network error removing movie");
    }
  };

  return (
    <section className="watchlistPage">
      <div className="watchlistHeader">
        <h1 className="watchlistTitle">Your Watchlist</h1>
      </div>

      <div className="watchlistStatus">
        {/* {loading && <p>Loading…</p>} */}
        {!loading && watchlist.length === 0 && <p>No saved movies yet.</p>}
      </div>

      {!loading && watchlist.length > 0 && (
        <div className="resultsGrid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.tmdbId}
              movie={{
                id: movie.tmdbId,
                title: movie.title,
                poster_path: movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
              }}
              onAddToWatchlist={() => handleRemove(movie.tmdbId)}
              actionLabel="Remove"
              actionVariant="danger"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WatchListPage;
