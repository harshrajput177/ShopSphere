// routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
} = require("../controllers/WishlistController");

const { protect } = require("../MiddleWare/authmiddleware");

router.post("/add", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.post("/remove", protect, removeWishlistItem);

module.exports = router;