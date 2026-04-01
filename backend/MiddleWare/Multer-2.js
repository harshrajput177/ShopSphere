// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Ensure uploads folder exists
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// 1️⃣ Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // folder to store original image
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 2️⃣ Sharp Compression Middleware (Runs After Upload)
const compressImages = async (req, res, next) => {
  const compress = async (file) => {
    const inputPath = file.path;
    const outputPath = inputPath.replace(path.extname(file.originalname), ".webp");

    await sharp(inputPath)
      .resize({ width: 800 }) // Resize to 800px width
      .webp({ quality: 70 }) // Convert and compress
      .toFile(outputPath);

    fs.unlinkSync(inputPath); // Delete original image
    file.path = outputPath;
    file.filename = path.basename(outputPath);
  };

  try {
    const fields = ["image", "thumbnails", "colorImages"];

    for (let field of fields) {
      if (req.files?.[field]) {
        await Promise.all(req.files[field].map(compress));
      }
    }

    // For single image (like .single() instead of .fields())
    if (req.file) {
      await compress(req.file);
    }

    next();
  } catch (err) {
    console.error("Image compression failed:", err);
    res.status(500).json({ error: "Image compression failed" });
  }
};

module.exports = {
  upload,
  compressImages,
};

