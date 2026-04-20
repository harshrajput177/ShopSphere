const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../Controller/BannerController");

const upload = require("../Config/CloudConfig"); // multer config

// ✅ ROUTES
router.post("/create", upload.single("image"), createBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

module.exports = router;