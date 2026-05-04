const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  title: String,
  image: String,
  price: Number,
  originalPrice: Number,
  size: String,
  qty: {
    type: Number,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    guestId: {
      type: String,
      default: null,
    },

    items: [cartItemSchema],
  },
  { timestamps: true }
);


cartSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);

cartSchema.index(
  { guestId: 1 },
  { unique: true, partialFilterExpression: { guestId: { $type: "string" } } }
);

module.exports = mongoose.model("Cart", cartSchema);