import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />);
  }

  return <div className="ratingStars">{stars}</div>;
};

export default RatingStars;
