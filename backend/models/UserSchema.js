const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true},
  phone: { type: String, unique: true, sparse: true},
  otp: { type: String },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  socialProvider: { type: String, enum: ['google', 'facebook'], default: null },
  socialId: { type: String, default: null },
  profilePic: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.models.userModel || mongoose.model('userModel', userSchema);
module.exports = userModel;


