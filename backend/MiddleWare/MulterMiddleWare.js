const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// 1. Multer Disk Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 16823238.jpg
  }
});

// 2. Optional File Filter
const fileFilter = (req, file, cb) => {
  console.log('Uploaded file:', file.originalname);
  cb(null, true);
};

// 3. Multer Upload Setup
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).fields([
  { name: 'image', maxCount: 1 },
  { name: "thumbnails", maxCount: 4 },
  { name: "colorImages", maxCount: 20 }
]);

// 4. Sharp Compression Middleware (after multer)
const compressImages = async (req, res, next) => {
  const compressSingleImage = async (file) => {
    const inputPath = file.path;
    const outputPath = inputPath.replace(path.extname(file.originalname), ".webp");

    await sharp(inputPath)
      .resize({ width: 800 }) // Resize width
      .webp({ quality: 70 })  // Compress to webp
      .toFile(outputPath);

    fs.unlinkSync(inputPath); // Remove original file
    file.path = outputPath;
    file.filename = path.basename(outputPath);
  };

  try {
    const fields = ['image', 'thumbnails', 'colorImages'];

    for (let field of fields) {
      if (req.files && req.files[field]) {
        await Promise.all(req.files[field].map(compressSingleImage));
      }
    }

    next();
  } catch (err) {
    console.error("Image compression failed:", err);
    res.status(500).json({ error: "Image processing failed" });
  }
};

module.exports = {
  upload,
  compressImages
};





