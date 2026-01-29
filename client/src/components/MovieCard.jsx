import { useState } from "react";
import RatingStars from "./RatingStars";
import { getStarRating } from "../utils/formatRating";

const MovieCard = ({
  movie,
  onAddToWatchlist,
  actionLabel = "+ Save to Watchlist",
  actionVariant = "primary",
}) => {
  const { title, poster_path, overview, release_date, vote_average } = movie;

  const [isExpanded, setIsExpanded] = useState(false);

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/placeholder.png";

  const dateLabel = release_date
    ? new Date(release_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  const hasLongOverview = (overview || "").length > 180;

  return (
    <article className="movie-card">
      <img className="moviePoster" src={posterUrl} alt={`${title} poster`} />

      <div className="card-info">
        <p className="label">
          Title: <span className="value titleClamp ">{title}</span>
        </p>

        <p className="label">
          Summary:{" "}
          <span className={`value italic ${isExpanded ? "" : "clamp"}`}>
            {overview || "—"}
          </span>
        </p>

        {hasLongOverview && (
          <button
            className="textBtn showMoreBtn"
            type="button"
            onClick={() => setIsExpanded((p) => !p)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}

        <p className="label">
          Release Date: <span className="value">{dateLabel}</span>
        </p>

        {/* <p className="label">
          Rating: 🎥{" "}
          <span className="value">{Math.floor(vote_average) ?? "—"}</span>
        </p> */}
        <div className="cardFooter">
          <div className="ratingRow">
            <RatingStars rating={getStarRating(movie.vote_average)} />
            <span className="ratingNumber">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          <button
            className={`btn saveBtn ${
              actionVariant === "danger" ? "dangerBtn" : ""
            }`}
            type="button"
            onClick={() => onAddToWatchlist?.(movie)}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
