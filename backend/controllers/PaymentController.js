const Razorpay = require("razorpay");
const crypto   = require("crypto");
const Order    = require("../models/Ordermodel");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Razorpay order create karo
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;  // amount in rupees

    const options = {
      amount:   Math.round(amount * 100),   // paise mein
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json({
      orderId:  razorpayOrder.id,
      amount:   razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key:      process.env.RAZORPAY_KEY_ID,  // frontend ko chahiye
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Step 2: Payment verify karo (signature check)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // HMAC signature verify
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Order update karo — paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus:     "Paid",
        status:            "Confirmed",
        razorpayPaymentId: razorpay_payment_id,
        $push: {
          statusHistory: {
            status:  "Confirmed",
            message: "Payment received. Order confirmed.",
          },
        },
      },
      { new: true }
    );

    res.json({ message: "Payment verified", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };