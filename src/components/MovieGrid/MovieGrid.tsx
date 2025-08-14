import css from "./MovieGrid.module.css"
import { Movie } from "../../types/movie"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const IMAGE_SIZE = "original";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export function MovieGrid({movies, onSelect}: MovieGridProps) {
  if (movies.length === 0) return null;  
  return <ul className={css.grid}>
    {movies.map((item) => {
      const imageUrl = getImageUrl(item.poster_path);
      return (
        <li key={item.id}>
          <div className={css.card} onClick={() => onSelect(item)}>
            {imageUrl ? (
              <img
                className={css.image}
                src={imageUrl}
                alt={item.title}
                loading="lazy"
              />
            ) : (
              <div className={css.noImage}>No image available</div>)}
            <h2 className={css.title}>{item.title}</h2>
          </div>
        </li>);
    })}
  </ul>;
}

function getImageUrl(path: string) {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${IMAGE_SIZE}${path}`;
}