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
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

exports.optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  }

  if (!req.user) {
    let guestId = req.cookies?.guestId;  // ← pehle existing check karo
    
    if (!guestId) {
      guestId = require("crypto").randomUUID();  // ← sirf tab naya banao
      res.cookie("guestId", guestId, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
    }
    
    req.guestId = guestId;  // ← yahan set karo, cookies pe depend mat karo
  }

  next();
};