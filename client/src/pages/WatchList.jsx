import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

const WatchListPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const movieItems = watchlist.filter(
    (item) => (item.mediaType || "movie") === "movie"
  );

  const tvItems = watchlist.filter((item) => item.mediaType === "tv");

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

  const handleRemove = async (tmdbId, mediaType) => {
    try {
      const res = await fetch(
        `http://localhost:5050/api/v1/watchlist/${tmdbId}?mediaType=${mediaType}`,
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
        prev.filter(
          (m) =>
            !(
              String(m.tmdbId) === String(tmdbId) &&
              String(m.mediaType || "movie") === String(mediaType)
            )
        )
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
        <h2>Movies</h2>
      </div>

      <div className="watchlistStatus">
        {/* {loading && <p>Loading…</p>} */}
        {!loading && movieItems.length === 0 && tvItems.length === 0 && (
          <p>No saved movies yet.</p>
        )}
      </div>

      {!loading && movieItems.length > 0 && (
        <div className="resultsGrid">
          {movieItems.map((item) => (
            <MovieCard
              key={`${item.mediaType || "movie"}-${item.tmdbId}`}
              movie={{
                id: item.tmdbId,
                title: item.title,
                poster_path: item.poster_path,
                overview: item.overview,
                release_date: item.release_date,
                vote_average: item.vote_average,
              }}
              onAddToWatchlist={() =>
                handleRemove(item.tmdbId, item.mediaType || "movie")
              }
              actionLabel="Remove"
              actionVariant="danger"
            />
          ))}
        </div>
      )}

      {!loading && (
        <div>
          <h2 style={{ fontSize: "28px", paddingLeft: "55px" }}>TV Shows</h2>

          {tvItems.length === 0 ? (
            <div className="watchlistStatus">
              <p>No saved TV shows yet.</p>
            </div>
          ) : (
            <div className="resultsGrid">
              {tvItems.map((item) => (
                <MovieCard
                  key={`${item.mediaType}-${item.tmdbId}`}
                  movie={{
                    id: item.tmdbId,
                    title: item.title,
                    poster_path: item.poster_path,
                    overview: item.overview,
                    release_date: item.release_date,
                    vote_average: item.vote_average,
                  }}
                  onAddToWatchlist={() =>
                    handleRemove(item.tmdbId, item.mediaType)
                  }
                  actionLabel="Remove"
                  actionVariant="danger"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default WatchListPage;
