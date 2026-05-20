const Rating   = require("../models/ReviewModel");
const Product  = require("../models/Product");

const recalcProductRating = async (productId) => {
  const result = await Rating.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg   = result[0]?.avg   ?? 0;
  const count = result[0]?.count ?? 0;
  await Product.findByIdAndUpdate(productId, {
    rating:      parseFloat(avg.toFixed(1)),
    ratingCount: count,
  });
};

// ── POST /api/ratings ────────────────────────────────────────
const submitRating = async (req, res) => {
  try {
    const { productId, rating, review, title } = req.body;
    const userId = req.user._id;

    // middleware ne upload karke req pe daal diya
    const images = req.uploadedImages || [];
    const video  = req.uploadedVideo  || null;

    const saved = await Rating.findOneAndUpdate(
      { product: productId, user: userId },
      { rating, review, title, images, video },
      { upsert: true, new: true, runValidators: true }
    );

    await recalcProductRating(productId);
    res.status(200).json({ message: "Rating saved", rating: saved });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Already rated" });
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/ratings/:productId ──────────────────────────────
const getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: ratings.filter((r) => r.rating === star).length,
    }));

    const withPhotos = ratings.filter((r) => r.images?.length > 0).length;
    const withVideos = ratings.filter((r) => r.video).length;

    res.json({ ratings, breakdown, total: ratings.length, withPhotos, withVideos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/ratings/:productId/mine ─────────────────────────
const getMyRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      product: req.params.productId,
      user:    req.user._id,
    });
    res.json({ rating: rating || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/ratings/:productId ──────────────────────────────
const updateRating = async (req, res) => {
  try {
    const { rating, review, title, existingImages, existingVideo } = req.body;
    const userId = req.user._id;

    const existing = await Rating.findOne({
      product: req.params.productId,
      user:    userId,
    });

    if (!existing)
      return res.status(404).json({ message: "Rating not found" });

    // purani images + naye upload combine karo
    const oldImages = Array.isArray(existingImages)
      ? existingImages
      : existingImages
        ? [existingImages]
        : existing.images || [];

    const newImages = req.uploadedImages || [];
    const newVideo  = req.uploadedVideo  || null;

    existing.rating = rating  ?? existing.rating;
    existing.review = review  ?? existing.review;
    existing.title  = title   ?? existing.title;
    existing.images = [...oldImages, ...newImages];
    existing.video  = newVideo || existingVideo || existing.video || null;

    await existing.save();
    await recalcProductRating(req.params.productId);

    res.json({ message: "Rating updated", rating: existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/ratings/:productId ───────────────────────────
const deleteRating = async (req, res) => {
  try {
    const deleted = await Rating.findOneAndDelete({
      product: req.params.productId,
      user:    req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Rating not found" });

    await recalcProductRating(req.params.productId);
    res.json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitRating,
  getProductRatings,
  getMyRating,
  updateRating,
  deleteRating,
};