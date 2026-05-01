// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // production => true
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.mobileAuth = async (req, res) => {
  try {
    const { mobile, name } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        mobile,
        name: name || "User",
        isVerified: true,
      });
    }

    generateTokenAndSetCookie(user, res);

    res.status(200).json({
      success: true,
      message: "Mobile login successful",
      user,
    });
  } catch (error) {
    console.log("mobileAuth Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        isVerified: true,
      });
    }

    generateTokenAndSetCookie(user, res);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user,
    });
  } catch (error) {
    console.log("googleLogin Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("getMe Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

  














