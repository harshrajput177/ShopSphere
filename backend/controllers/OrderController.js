const Order   = require("../models/Ordermodel");
const Product = require("../models/Product");
const Cart    = require("../models/Cart");

// ── CREATE order ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      items, shippingAddress,
      paymentMethod, itemsTotal,
      discount, deliveryCharge, totalAmount,
      razorpayOrderId,
    } = req.body;

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 6);

    const initialStatus = paymentMethod === "COD" ? "Confirmed" : "Pending";

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      itemsTotal,
      discount:        discount        || 0,
      deliveryCharge:  deliveryCharge  || 0,
      totalAmount,
      razorpayOrderId: razorpayOrderId || null,
      paymentStatus:   "Pending",
      status:          initialStatus,
      expectedDelivery,
      statusHistory: [{
        status:  initialStatus,
        message: paymentMethod === "COD"
          ? "Order placed successfully. Pay on delivery."
          : "Order placed. Awaiting payment.",
      }],
    });

    await Cart.deleteMany({
      $or: [
        { user:    req.user.id },
        { guestId: req.cookies.guestId },
      ],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET my orders ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "title variants");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET order by id ───────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id:  req.params.id,
      user: req.user.id,
    }).populate("items.product", "title variants");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CANCEL order ─────────────────────────────────────────────
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // "Packed" added — user can cancel until order is shipped
    const cancellable = ["Pending", "Confirmed", "Packed"];
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled now" });
    }

    order.status       = "Cancelled";
    order.cancelReason = req.body.reason || "Cancelled by user";
    order.statusHistory.push({
      status:  "Cancelled",
      message: req.body.reason || "Cancelled by user",
    });
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN: get all orders ─────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("user", "name email")
      .populate("items.product", "title");

    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN: update order status ────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({
      status,
      message: message || `Status updated to ${status}`,
    });
    if (status === "Delivered") order.deliveredAt = new Date();

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Latest order of user ──────────────────────────────────────
const getUserLatestOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delivered orders count ────────────────────────────────────
const getDeliveredOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "Delivered" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getUserLatestOrder,
  getDeliveredOrdersCount,
};