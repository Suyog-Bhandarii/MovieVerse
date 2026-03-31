import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieList from "./MovieList";
import "./Search.css";

const Search = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");
  const suggestions = ["Dune", "Inception", "Barbie", "Interstellar"];

  useEffect(() => {
    if (!query || query.trim() === "") {
      setError(null);
      setSearchTerm("");
      setResults([]);
      return;
    }

    setSearchTerm(query);
    setError(null);
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=617d094eee05251e086a9284174e2765&query=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => setResults(data.results || []))
      .catch(() => setError("Something went wrong while searching."))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setError(null);
    setResults([]);
    navigate("/search");
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm ? (
          <button type="button" className="search-clear" onClick={handleClearSearch}>
            Clear
          </button>
        ) : null}
        <button type="submit" className="search-button">Search</button>
      </form>

      <h2 className="search-results-heading">
        {query ? `Search Results for "${query}"` : "Find your next movie"}
      </h2>
      <p className="search-helper">
        {query
          ? "Browse matching titles and jump straight into the details page."
          : "Search the TMDB catalog and explore titles in a Netflix-inspired layout."}
      </p>
      {!loading && !error && query ? (
        <p className="search-meta">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      ) : null}

      {loading && <p className="search-status">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!query && !loading && !error ? (
        <div className="search-empty-state">
          <h3>Try one of these</h3>
          <div className="search-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="search-suggestion"
                onClick={() =>
                  navigate(`/search?query=${encodeURIComponent(suggestion)}`)
                }
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!loading && !error && query && results.length === 0 && (
        <p className="search-empty">No results found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="search-results-grid">
          <MovieList movies={results} />
        </div>
      )}
    </div>
  );
};

export default Search;
