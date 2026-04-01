const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 🔥 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// 🔥 Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],

    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname;
    }
  }
});

// 🔥 Multer setup
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// ✅ EXPORT
module.exports = upload;