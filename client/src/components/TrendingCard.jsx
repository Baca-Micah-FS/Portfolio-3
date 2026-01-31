import RatingStars from "./RatingStars";
import { getStarRating } from "../utils/formatRating";

const TrendingCard = ({ movie, onSave }) => {
  const { title, release_date, vote_average } = movie;

  const posterPath = movie.poster_path;

  const stars = getStarRating(movie.vote_average);

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder.png";

  const dateLabel = release_date
    ? new Date(release_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <>
      <article className="trendingContainer">
        <img src={posterUrl} alt={`${movie.title} poster`} />
        <h2 className="trendingTitle">{title}</h2>
        <p>{dateLabel || "Unknown"}</p>
        <div className="cardFooter">
          <div className="ratingRow">
            <RatingStars rating={stars} />
            <span className="ratingNumber">
              {vote_average ? vote_average.toFixed(1) : "—"}
            </span>
          </div>

          <button type="button" onClick={() => onSave(movie)}>
            Save
          </button>
        </div>
      </article>
    </>
  );
};

export default TrendingCard;
