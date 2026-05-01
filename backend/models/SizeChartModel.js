const mongoose = require("mongoose");

const sizeChartSchema = new mongoose.Schema(
  {
    // Gender model reference
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
      required: true
    },

    // Product Type reference
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true
    },

    // Dynamic size chart fields
    // Example:
    // ["Waist", "Hip", "Length"]
    // ["Bust", "Waist", "Sleeve Length"]
    fields: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// same ProductType + same Gender ka duplicate size chart na bane
sizeChartSchema.index(
  {
    productType: 1,
    gender: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  "SizeChart",
  sizeChartSchema
);