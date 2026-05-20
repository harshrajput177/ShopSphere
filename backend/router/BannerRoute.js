const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/BannerController");

const upload = require("../Config/CloudConfig"); // multer config


router.post("/create", upload.single("image"), createBanner);
router.get("/", getBanners);
router.put("/:id", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;