import { useEffect, useState } from "react";
import { WatchlistContext } from "./watchlist-context";

const readStoredWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  } catch {
    return [];
  }
};

const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(readStoredWatchlist);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist((currentWatchlist) => {
      if (currentWatchlist.some((item) => item.id === movie.id)) {
        return currentWatchlist;
      }

      return [...currentWatchlist, movie];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((currentWatchlist) =>
      currentWatchlist.filter((movie) => movie.id !== id)
    );
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistProvider;
