import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { WatchlistContext } from "../context/watchlist-context";

const MovieCard = ({ movie }) => {
  const { user } = useContext(AuthContext);
  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useContext(WatchlistContext);
  const location = useLocation();
  const navigate = useNavigate();
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://placehold.co/300x450/262626/a1a1aa?text=No+Poster";
  const rating = Number(movie.vote_average);
  const ratingLabel = Number.isFinite(rating) ? `Rating ${rating.toFixed(1)}` : "Details";
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "Release TBA";
  const isInWatchlist = watchlist.some((savedMovie) => savedMovie.id === movie.id);

  const handleWatchlistClick = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
      return;
    }

    addToWatchlist(movie);
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-poster-wrap">
          <img src={poster} alt={movie.title} className="movie-img" />
          <div className="movie-card-overlay">
            <span className="movie-card-badge">{ratingLabel}</span>
            <span className="movie-card-cta">View details</span>
          </div>
        </div>
        <div className="movie-card-body">
          <h3>{movie.title}</h3>
          <p>{releaseYear}</p>
        </div>
      </Link>
      <div className="movie-card-actions">
        <button
          type="button"
          className={`movie-card-action${isInWatchlist ? " is-active" : ""}`}
          onClick={handleWatchlistClick}
        >
          {!user ? "Log in to save" : isInWatchlist ? "Remove from My List" : "Save to My List"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
