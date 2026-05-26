const express = require("express");
const router = express.Router();
const Coupon = require("../models/CouponModel");
const {protect} = require("../MiddleWare/authmiddleware"); // apna existing admin middleware

router.get("/product/:productId", async (req, res) => {
  try {
    const now = new Date();
    const query = {
      isActive: true,
      expiryDate: { $gt: now },
    };

    // "all" pass hua matlab cart-level coupons chahiye
    if (req.params.productId !== "all") {
      query.$or = [
        { applicableTo: "all" },
        { applicableTo: "product", productIds: req.params.productId },
      ];
    } else {
      query.applicableTo = "all";
    }

    const coupons = await Coupon.find(query)
      .select("code description discountType discountValue maxDiscount minOrderAmount expiryDate")
      .sort({ discountValue: -1 });

    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons" });
  }
});

// ── Public: coupon validate + apply (cart/checkout pe) ───────
router.post("/apply", async (req, res) => {
  const { code, orderAmount, productId } = req.body;
  try {
    const now = new Date();
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon)                          return res.status(404).json({ message: "Coupon not found" });
    if (coupon.expiryDate < now)          return res.status(400).json({ message: "Coupon expired" });
    if (orderAmount < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order ₹${coupon.minOrderAmount} required` });
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: "Coupon usage limit reached" });

    // Applicability check
    if (coupon.applicableTo === "product" && productId &&
        !coupon.productIds.map(String).includes(String(productId))) {
      return res.status(400).json({ message: "Coupon not applicable on this product" });
    }

    // Discount calculate
    let discount = coupon.discountType === "flat"
      ? coupon.discountValue
      : (orderAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, orderAmount); // negative price nahi hogi

    res.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discount: Math.round(discount),
      finalAmount: Math.round(orderAmount - discount),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── Admin: CRUD ───────────────────────────────────────────────
router.post("/",      protect, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/",        protect, async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

router.put("/:id",     protect, async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
});

router.delete("/:id",  protect, async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;