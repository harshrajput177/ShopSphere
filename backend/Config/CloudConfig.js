const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],

    public_id: (req, file) => {
      // ✅ Extension hata do originalname se
      const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
      return Date.now() + "-" + nameWithoutExt;
      // "1775476630-banner" → Cloudinary .png add karega → "1775476630-banner.png" ✅
    }
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;