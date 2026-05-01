const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    googleId: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);


