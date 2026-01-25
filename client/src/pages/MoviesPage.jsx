import React from "react";
import { useState } from "react";

const MoviesPage = () => {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="form-wrapper">
        <form className="form-container">
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
      </div>
    </>
  );
};
export default MoviesPage;
