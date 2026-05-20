const express = require("express");
const router = express.Router();
const {
  checkPincodeController,
} = require("../controllers/pincodeController");

// GET /api/pincode/check/:pincode
router.get("/check/:pincode", checkPincodeController);

module.exports = router;