// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("protect Middleware Error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};