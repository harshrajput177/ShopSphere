const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
    }
  ],
  totalAmount: Number,
  paymentMethod: String, // 'COD' or 'ONLINE'
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String, // 'success', 'declined'
    enum: ['success', 'declined'],
    default: 'declined',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
