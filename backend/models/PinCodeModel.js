// models/Pincode.js
const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode:        { type: String, required: true, unique: true },
  city:           String,
  state:          String,
  is_serviceable: { type: Boolean, default: false },
  cod_available:  { type: Boolean, default: false },
  delivery_days:  { type: Number, default: 5 },
  last_checked:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pincode', pincodeSchema);