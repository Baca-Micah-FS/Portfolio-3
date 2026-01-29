export const getStarRating = (voteAverage) => {
  if (!voteAverage) return 0;

  // Convert 0–10 scale to 0–5
  return Math.round(voteAverage / 2);
};
