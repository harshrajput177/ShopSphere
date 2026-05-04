const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String 
    },

    group: {
      type: String,
      enum: [
        "Topwear",
        "Bottomwear",
        "Innerwear",
        "Co-ord Set",
        "OnePiece",
        "Outerwear",
        "Other"
      ],
      required: true
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// same subCategory me duplicate ProductType avoid
productTypeSchema.index(
  {
    name: 1,
    subCategory: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  "ProductType",
  productTypeSchema
);