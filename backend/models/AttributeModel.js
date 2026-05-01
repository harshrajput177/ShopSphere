const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    // text | select | number
    type: {
      type: String,
      enum: ["text", "select", "number"],
      required: true
    },

    // for select type
    options: [
      {
        type: String
      }
    ],

    // multiple product types support
    productTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
        required: true
      }
    ],

    // size related attribute
    isSize: {
      type: Boolean,
      default: false
    },

    // optional default number value
    numberValue: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Attribute",
  attributeSchema
);