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
  const isProduction = process.env.NODE_ENV === "production"; // ← ADD

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  }

  if (!req.user) {
    if (!req.cookies?.guestId) {
      const guestId = require("crypto").randomUUID();

      res.cookie("guestId", guestId, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "None" : "Lax", // ← MAIN FIX
        secure: isProduction ? true : false,      // ← MAIN FIX
      });

      req.guestId = guestId;
    } else {
      req.guestId = req.cookies.guestId;
    }
  }

  next();
};