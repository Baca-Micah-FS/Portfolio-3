import { useState } from "react";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

const MoviesPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // show 5 at first

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    const res = await fetch(
      `http://localhost:5050/api/v1/movies/search?query=${encodeURIComponent(
        trimmed
      )}`
    );

    const data = await res.json();
    setResults(data.results || []);
    setVisibleCount(5); // reset back to 5 every new search
  };

  const hasResults = results.length > 0;
  const shownResults = results.slice(0, visibleCount);

  const handleAddToWatchlist = async (movie) => {
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

      console.log("Saved:", data);
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error saving movie ");
    }
  };

  return (
    <section className={`moviesLayout ${hasResults ? "hasResults" : ""}`}>
      <div className="moviesSidebar">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Search Movies</h1>

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
            {shownResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddToWatchlist={handleAddToWatchlist}
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

export default MoviesPage;
