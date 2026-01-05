const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    spotifyId: {
      type: String,
      require: true,
    },

    type: {
      type: String,
      enum: ["track", "artist", "album"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    spotifyUserId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
