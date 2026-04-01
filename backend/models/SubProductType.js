const mongoose = require("mongoose");

const subProductTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String // optional
  },

  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType",
    required: true
  },

  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("SubProductType", subProductTypeSchema);