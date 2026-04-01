const jwt = require("jsonwebtoken");
const userModel = require('../models/UserSchema');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, login again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // ✅ Attach user to req for next middleware or routes
    next(); // ✅ call next instead of res.send here
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authMiddleware;
