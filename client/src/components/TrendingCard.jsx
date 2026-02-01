import RatingStars from "./RatingStars";
import { getStarRating } from "../utils/formatRating";

const TrendingCard = ({ movie, onSave }) => {
  const title = movie.title || movie.name || "Untitled";
  const rawDate = movie.release_date || movie.first_air_date;

  const posterPath = movie.poster_path;
  const stars = getStarRating(movie.vote_average);

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder.png";

  const dateLabel = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <article className="trendingContainer">
      <img src={posterUrl} alt={`${title} poster`} />
      <h2 className="trendingTitle">{title}</h2>
      <p>{dateLabel}</p>

      <div className="cardFooter">
        <div className="ratingRow">
          <RatingStars rating={stars} />
          <span className="ratingNumber">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(movie);
          }}
        >
          Save
        </button>
      </div>
    </article>
  );
};

export default TrendingCard;
