import { useEffect, useState } from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ onSelect, value = "" }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=617d094eee05251e086a9284174e2765`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) {
          return;
        }

        setCategories(data.genres || []);
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="category-pills-container">
      {loading ? (
        <div className="category-pill skeleton">Loading...</div>
      ) : error ? (
        <div className="category-pill error">Unavailable</div>
      ) : (
        <>
          <button
            className={`category-pill ${value === "" ? "active" : ""}`}
            onClick={() => onSelect("")}
          >
            All Movies
          </button>
          {categories.map((genre) => (
            <button
              key={genre.id}
              className={`category-pill ${String(value) === String(genre.id) ? "active" : ""}`}
              onClick={() => onSelect(String(genre.id))}
            >
              {genre.name}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default CategoryFilter;
