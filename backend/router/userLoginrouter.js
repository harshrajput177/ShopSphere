const express = require("express");
const router = express.Router();

const {
  mobileAuth,
  googleLogin,
  getMe,
  logout,
} = require("../Controller/userLoginController");

const { protect } = require("../MiddleWare/authmiddleware");

router.post("/mobile-login", mobileAuth);

router.post("/google-login", googleLogin);

router.get("/me", protect, getMe);

router.post("/logout", logout);

module.exports = router;