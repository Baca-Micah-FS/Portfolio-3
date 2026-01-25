import React from "react";
import { useState } from "react";

const MoviesPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const res = await fetch(
      `http://localhost:5050/api/v1/movies/search?query=${encodeURIComponent(
        query
      )}`
    );

    const data = await res.json();
    setResults(data.results) || [];
  };

  return (
    <>
      <div className="form-wrapper">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Search Movies</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            placeholder="Search"
          ></input>
          <button className="btn" type="submit">
            Search
          </button>
        </form>
        <ul>
          {results &&
            results.map((movie) => <li key={movie.id}>{movie.title}</li>)}
        </ul>
      </div>
    </>
  );
};
export default MoviesPage;
