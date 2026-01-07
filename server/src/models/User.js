const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    spotifyUserId: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      //   required: true,
      //   unique: true,
    },

    email: {
      type: String,
    },

    imageUrl: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
