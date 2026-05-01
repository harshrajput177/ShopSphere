const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      required: true
    },

    image: {
      type: String // cloudinary URL
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Gender", genderSchema);