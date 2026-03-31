import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import CategoryFilter from "../components/CategoryFilter";
import "./Home.css";

const API_KEY = "617d094eee05251e086a9284174e2765";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");

    if (selectedCategory) {
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isMounted) return;
          setCategoryMovies(data.results || []);
          setIsLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setError("We couldn't load movies right now. Please try again in a moment.");
          setIsLoading(false);
        });
    } else {
      Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`).then(res => res.json())
      ])
        .then(([trendingData, newData]) => {
          if (!isMounted) return;
          setTrendingMovies(trendingData.results || []);
          setNewReleases(newData.results || []);
          setIsLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setError("We couldn't load movies right now. Please try again in a moment.");
          setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const featuredMovie = selectedCategory ? categoryMovies[0] : trendingMovies[0];
  const heroStyle = featuredMovie?.backdrop_path
    ? {
        "--hero-backdrop": `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
      }
    : undefined;

  return (
    <div className="home-container">
      <section className="hero-banner" style={heroStyle}>
        <div className="hero-content">
          <p className="hero-kicker">
            {selectedCategory ? "Curated picks" : "Featured this week"}
          </p>
          <h1 className="hero-title">
            {featuredMovie?.title ?? "Unlimited stories, one cinematic home."}
          </h1>
          <p className="hero-description">
            {featuredMovie?.overview ??
              "Browse trending releases, explore the details, and save your next watch in a darker streaming-inspired experience."}
          </p>
          <div className="hero-actions">
            <Link to="/search" className="hero-button">Search movies</Link>
            <Link to="/watchlist" className="hero-button hero-button-secondary">My watchlist</Link>
          </div>
          <div className="hero-meta">
            {featuredMovie?.vote_average ? (
              <span className="hero-chip">
                Rating {Number(featuredMovie.vote_average).toFixed(1)}
              </span>
            ) : null}
            {featuredMovie?.release_date ? (
              <span className="hero-chip">{featuredMovie.release_date.slice(0, 4)}</span>
            ) : null}
            <span className="hero-chip">
              {selectedCategory ? "Genre filter on" : "Trending now"}
            </span>
          </div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Browse</p>
            <h2 className="section-title">
              {selectedCategory ? "Genre Picks" : "The Cinematic Experience"}
            </h2>
            <p className="section-subtitle">
              A darker streaming-style layout with bold posters, focused typography, and quick access to movie details.
            </p>
          </div>

          <div className="filter-bar">
            <CategoryFilter value={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </div>

        {error ? (
          <p className="page-error">{error}</p>
        ) : isLoading ? (
          <p className="page-status">Loading movies for you...</p>
        ) : selectedCategory ? (
          <div className="movie-row">
            <MovieList movies={categoryMovies} />
          </div>
        ) : (
          <div className="multi-row-layout">
            <div className="movie-row-container">
              <h3 className="row-title">Trending Now</h3>
              <div className="movie-row">
                <MovieList movies={trendingMovies} />
              </div>
            </div>
            
            <div className="movie-row-container">
              <h3 className="row-title">New Releases</h3>
              <div className="movie-row">
                <MovieList movies={newReleases} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
