const userModel = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
const validator = require('validator');
const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// JWT Token creation with a check on secret
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4d' });
};

// OTP storage (in-memory, reset on server restart)
const OTP_STORE = {};

// Generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP via Twilio
const sendOtpViaSMS = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    // console.log("OTP sent:", message.sid);
  } catch (err) {
    console.error("OTP send error:", err.message);
    throw new Error("Failed to send OTP");
  }
};

// Get user details by JWT decoded user id
const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await userModel.findById(req.user.id).select("-otp");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user", error: err.message });
  }
};

// Registration with OTP
const registerUser = async (req, res) => {
  let { name, email, phone } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email & phone required" });
    }

    // Ensure phone starts with +91
    if (!phone.startsWith("+91")) {
      phone = "+91" + phone;
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const exists = await userModel.findOne({ phone });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate OTP for registration verification
    const otp = generateOTP();

    // Store OTP and registration details to OTP_STORE
    OTP_STORE[phone] = { name, email, otp };

    // Send OTP via SMS
    await sendOtpViaSMS(phone, otp);

    res.status(200).json({ success: true, message: "OTP sent to phone" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Social login (Google/Facebook etc)
const socialLogin = async (req, res) => {
  const { provider, socialId, email, name, profilePic } = req.body;

  if (!provider || !socialId || !email) {
    return res.status(400).json({ success: false, message: "Provider, SocialId, and Email required" });
  }

  try {
    let user = await userModel.findOne({ $or: [{ socialId }, { email }] });

    if (user) {
      if (!user.socialId) {
        user.socialId = socialId;
        user.socialProvider = provider;
        await user.save();
      }
    } else {
      // New user → create entry
      user = new userModel({
        name,
        email,
        socialProvider: provider,
        socialId,
        profilePic,
        isVerified: true,
      });
      await user.save();
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, message: "Social login successful", token, user });

  } catch (err) {
    console.error("Social Login Error:", err);
    res.status(500).json({ success: false, message: "Social login failed", error: err.message });
  }
};

// OTP verification for login/register
const verifyOtp = async (req, res) => {
  let { phone, otp, mode, name, email } = req.body;

  try {
    if (!phone || !otp || !mode) {
      return res.status(400).json({ success: false, message: "Phone, OTP and Mode required" });
    }

    // Ensure phone starts with +91
    if (!phone.startsWith("+91")) {
      phone = "+91" + phone;
    }

    const userData = OTP_STORE[phone];
    if (!userData) {
      return res.status(400).json({ success: false, message: "OTP session expired or not found" });
    }

    if (userData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    if (mode === "register") {
      if (!name || !email) {
        return res.status(400).json({ success: false, message: "Name and Email required for registration" });
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists, please login." });
      }

      // Create new user with all details
      const newUser = new userModel({
        name,
        email,
        phone,
        isVerified: true,
      });

      await newUser.save();

      // Clear OTP from store after success
      delete OTP_STORE[phone];
      const token = createToken(newUser._id);
      return res.status(200).json({ success: true, message: "User registered successfully", token });

    } else if (mode === "login") {

      let existingUser = await userModel.findOne({ phone });

       if (!existingUser) {
        existingUser = new userModel({
        phone,
         isVerified: true,
         });
        await existingUser.save();

        delete OTP_STORE[phone];
        const token = createToken(existingUser._id);
        return res.status(200).json({
          success: true,
          message: "New user created and logged in",
          token,
          userId: existingUser._id,
          isNewUser: true,
        });
      }

      // User found - log in
      delete OTP_STORE[phone];
      const token = createToken(existingUser._id);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        userId: existingUser._id,
        isNewUser: false,
      });

    } else {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send OTP endpoint for login or register
const sendOtp = async (req, res) => {
  let { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  // Validate phone number format +91XXXXXXXXXX
  if (!phone.startsWith("+91")) {
    phone = "+91" + phone;
  }

  if (!/^\+91\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be in +91XXXXXXXXXX format",
    });
  }

  const otp = generateOTP();
  OTP_STORE[phone] = { otp };

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

module.exports = {
  getUser,
  sendOtp,
  registerUser,
  verifyOtp,
  socialLogin
};


  














