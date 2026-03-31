import { useContext } from "react";
import { WatchlistContext } from "../context/watchlist-context";
import MovieList from "../components/MovieList";

const Watchlist = () => {
  const { watchlist } = useContext(WatchlistContext);

  return (
    <div className="page-shell watchlist-page">
      <div className="page-heading">
        <p className="page-kicker">My List</p>
        <h1>Your Watchlist</h1>
        <p className="page-summary">
          Saved titles stay here so you can jump back in any time.
        </p>
      </div>
      {watchlist.length === 0 ? (
        <p className="page-empty">No movies in watchlist yet.</p>
      ) : (
        <MovieList movies={watchlist} />
      )}
    </div>
  );
};

export default Watchlist;
