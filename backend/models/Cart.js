const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    
  productId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
     },

  title: String,
  image: String,
  price: Number,
  size: String,
  color: String,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
