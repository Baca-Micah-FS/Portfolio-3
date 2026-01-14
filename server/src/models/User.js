const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleUserId: {
      type: String,
    },

    displayName: {
      type: String,
      //   required: true,
      //   unique: true,
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

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
