import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { WatchlistContext } from "../context/watchlist-context";

const API_KEY = "617d094eee05251e086a9284174e2765";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useContext(AuthContext);
  const { addToWatchlist, watchlist, removeFromWatchlist } =
    useContext(WatchlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load movie details");
        }

        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setMovie(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("We couldn't load this movie right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFeedback(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  if (isLoading) return <p className="page-shell detail-loading">Loading movie details...</p>;
  if (error) {
    return (
      <div className="page-shell detail-loading detail-error-state">
        <p className="page-error">{error}</p>
        <button type="button" className="detail-back" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }
  if (!movie) return <p className="page-shell detail-loading">Movie not found.</p>;

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);
  const rating = Number(movie.vote_average);
  const handleWatchlistClick = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
      setFeedback("Removed from your watchlist.");
      return;
    }

    addToWatchlist(movie);
    setFeedback("Added to your watchlist.");
  };

  return (
    <div className="page-shell detail-page">
      <div className="detail-visual">
        <img
          className="detail-poster"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/500x750/262626/a1a1aa?text=No+Poster"
          }
          alt={movie.title}
        />
      </div>

      <div className="detail-copy">
        <button type="button" className="detail-back" onClick={() => navigate(-1)}>
          Back
        </button>
        <p className="page-kicker">Movie details</p>
        <h1>{movie.title}</h1>
        <div className="detail-meta">
          {Number.isFinite(rating) ? (
            <span className="detail-chip">Rating {rating.toFixed(1)}</span>
          ) : null}
          {movie.release_date ? (
            <span className="detail-chip">{movie.release_date}</span>
          ) : null}
          {movie.runtime ? (
            <span className="detail-chip">{movie.runtime} min</span>
          ) : null}
        </div>

        {movie.genres?.length ? (
          <div className="detail-tags">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="detail-tag">
                {genre.name}
              </span>
            ))}
          </div>
        ) : null}

        <p className="detail-overview">
          {movie.overview || "No overview is available for this title yet."}
        </p>

        {feedback ? <p className="detail-feedback" aria-live="polite">{feedback}</p> : null}

        <button
          className="watchlist-btn detail-button"
          onClick={handleWatchlistClick}
        >
          {!user
            ? "Log in to save this movie"
            : isInWatchlist
              ? "Remove from Watchlist"
              : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieDetail;
