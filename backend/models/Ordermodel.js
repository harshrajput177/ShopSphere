const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title:         { type: String, required: true },
  image:         { type: String },
  size:          { type: String },
  color:         { type: String },
  quantity:      { type: Number, required: true, min: 1 },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
});

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderNumber: { type: String, unique: true },
  items:       [orderItemSchema],

  shippingAddress: {
    name:     String,
    phone:    String,
    address:  String,
    locality: String,
    city:     String,
    state:    String,
    pincode:  String,
    landmark: String,
  },

  itemsTotal:     { type: Number, required: true },
  discount:       { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  totalAmount:    { type: Number, required: true },

  paymentMethod:      { type: String, enum: ["Razorpay", "COD"], required: true },
  paymentStatus:      { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  razorpayOrderId:    { type: String },
  razorpayPaymentId:  { type: String },

  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Packed",      
      "Shipped",
      "Delivered",
      "Cancelled",
      "Return Requested",
      "Returned",
    ],
    default: "Pending",
  },

  statusHistory: [{
    status:    String,
    message:   String,
    updatedAt: { type: Date, default: Date.now },
  }],

  cancelReason:     { type: String },
  deliveredAt:      { type: Date },
  expectedDelivery: { type: Date },

}, { timestamps: true });

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);