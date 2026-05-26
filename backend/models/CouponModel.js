const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ["flat", "percent"], required: true },
  discountValue: { type: Number, required: true },
  maxDiscount: { type: Number, default: null },   // percent coupons ke liye cap
  minOrderAmount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null },     // null = unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  applicableTo: {
    type: String,
    enum: ["all", "category", "product"],
    default: "all"
  },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  productIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

module.exports = mongoose.model("Coupon", CouponSchema);