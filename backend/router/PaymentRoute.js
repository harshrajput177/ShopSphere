const express = require("express");
const { createRazorpayOrder, verifyPayment } = require("../controllers/PaymentController");
const { protect } = require("../MiddleWare/authmiddleware");

const router = express.Router();
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify",       protect, verifyPayment);

module.exports = router;