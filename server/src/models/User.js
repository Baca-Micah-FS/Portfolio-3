const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleUserId: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
    },

    email: {
      type: String,
    },

    picture: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    accessToken: {
      type: String,
    },

    accessTokenExpiresAt: {
      type: Date,
    },

    jwtToken: {
      type: String,
      default: null,
    },

    lastLoginAt: {
      type: Date,
    },

    watchlist: [
      {
        tmdbId: Number,
        mediaType: { type: String, enum: ["movie", "tv"], default: "movie" },
        title: String,
        poster_path: String,
        overview: String,
        release_date: String,
        vote_average: Number,
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
