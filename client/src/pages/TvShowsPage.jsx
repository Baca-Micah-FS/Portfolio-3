import { useState } from "react";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

const TvShowsPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    const res = await fetch(
      `http://localhost:5050/api/v1/tv/search?query=${encodeURIComponent(
        trimmed
      )}`
    );

    const data = await res.json();
    setResults(data.results || []);
    setVisibleCount(5);
  };

  const hasResults = results.length > 0;
  const shownResults = results.slice(0, visibleCount);

  const handleAddToWatchlist = async (show) => {
    try {
      const res = await fetch("http://localhost:5050/api/v1/watchlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: show.id,
          mediaType: "tv",
          title: show.name,
          release_date: show.first_air_date,
          poster_path: show.poster_path,
          overview: show.overview,
          vote_average: show.vote_average,
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
      toast.error("Network error saving TV show");
    }
  };

  return (
    <section className={`moviesLayout ${hasResults ? "hasResults" : ""}`}>
      <div className="moviesSidebar">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Search TV Shows</h1>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            placeholder="Search"
          />

          <button className="btn" type="submit">
            Search
          </button>
        </form>
      </div>

      {hasResults && (
        <div className="resultsArea">
          <div className="resultsGrid">
            {shownResults.map((show) => (
              <MovieCard
                key={show.id}
                movie={{
                  ...show,
                  title: show.name,
                  release_date: show.first_air_date,
                }}
                onAddToWatchlist={() => handleAddToWatchlist(show)}
              />
            ))}
          </div>

          {results.length > visibleCount && (
            <div className="resultsMoreRow">
              <button
                className="btn"
                type="button"
                onClick={() => setVisibleCount((c) => c + 5)}
              >
                Show 5 more
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TvShowsPage;
