const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

      console.log("🍪 Cookie received:", req.cookies); // Add this log temporarily
  console.log("🔑 Token:", token); 

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

exports.optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ ye add karo
      req.user = decoded; // ✅ ye add karo
    } catch (err) {
      req.user = null; // invalid token toh guest treat karo
    }
  }

  if (!req.user) {
    if (!req.cookies?.guestId) {
      const guestId = require("crypto").randomUUID();
      res.cookie("guestId", guestId, { 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true 
      });
      req.guestId = guestId;
    } else {
      req.guestId = req.cookies.guestId;
    }
  }

  next();
};