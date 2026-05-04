// models/Wishlist.js
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
 items: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: String,
    image: String,
    price: Number,
    originalPrice: Number,

    sizes: [
      {
        size: String,
        price: Number,
      }
    ]
  },
]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
