const express = require("express");
const router = express.Router();
const {
  checkPincodeController,
} = require("../controllers/PinCodeController");


router.get("/check/:pincode", checkPincodeController);

module.exports = router;