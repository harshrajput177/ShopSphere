const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeItem,
  mergeCart,
} = require("../controllers/CartController");

const { optionalAuth, protect } = require("../MiddleWare/authmiddleware");


router.post("/add", optionalAuth, addToCart);
router.get("/", optionalAuth, getCart);
router.post("/remove", optionalAuth, removeItem);


router.post("/merge", protect, mergeCart);

module.exports = router;