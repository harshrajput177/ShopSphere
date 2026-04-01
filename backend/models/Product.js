const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({

  // 🔹 BASIC INFO
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  shortDescription: {
    type: String // optional (card ke liye)
  },

  price: {
    type: Number,
    required: true
  },

  // 🔹 CATEGORY RELATION
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },

  productType: {
    type: String,
    required: true // T-Shirts, Jeans etc
  },

  // 🔹 COLLECTIONS (MULTIPLE)
  collections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection"
    }
  ],

  // 🔹 FLAGS (FILTERS)
  isBestSeller: {
    type: Boolean,
    default: false
  },

  isTrending: {
    type: Boolean,
    default: false
  },

  isNewArrival: {
    type: Boolean,
    default: false
  },

  isGenZ: {
    type: Boolean,
    default: false
  },

  // 🔹 SPECIFICATIONS (DYNAMIC 🔥)
  specifications: {
    type: Map,
    of: String
  },

  // 🔹 IMAGES
  images: {
    front: String,
    thumbnails: [String],
    colors: [String]
  },

  // 🔹 EXTRA (future use)
  stock: {
    type: Number,
    default: 0
  },

  sold: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);