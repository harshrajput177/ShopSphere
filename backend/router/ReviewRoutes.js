const express        = require("express");
const multer         = require("multer");
const streamifier    = require("streamifier");
const cloudinary     = require("../Config/CloudConfig");
const {
  submitRating,
  getProductRatings,
  getMyRating,
  updateRating,
  deleteRating,
} = require("../controllers/ReveiwController");
const { protect } = require("../MiddleWare/authmiddleware");

const router = express.Router();

// ── Multer — memory storage (disk pe kuch nahi likhta) ───────
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },   // 50 MB per file
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, MP4 allowed."));
    }
  },
});

// ── Cloudinary upload helper ─────────────────────────────────
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── Media upload middleware ───────────────────────────────────
// images (max 5) + video (max 1) ek saath handle karta hai
const handleMediaUpload = async (req, res, next) => {
  try {
    req.uploadedImages = [];
    req.uploadedVideo  = null;

    // Images upload karo
    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const result = await uploadToCloudinary(file.buffer, {
          folder:        "reviews/images",
          resource_type: "image",
          transformation: [{ width: 900, crop: "limit", quality: "auto:good" }],
        });
        req.uploadedImages.push(result.secure_url);
      }
    }

    // Video upload karo
    if (req.files?.video?.[0]) {
      const result = await uploadToCloudinary(req.files.video[0].buffer, {
        folder:        "reviews/videos",
        resource_type: "video",
      });
      req.uploadedVideo = result.secure_url;
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Media upload failed: " + err.message });
  }
};

// ── Routes ───────────────────────────────────────────────────

// POST /api/ratings — new rating with optional images + video
router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video",  maxCount: 1 },
  ]),
  handleMediaUpload,
  submitRating
);

// GET /api/ratings/:productId — sabke ratings
router.get("/:productId", getProductRatings);

// GET /api/ratings/:productId/mine — sirf meri rating
router.get("/:productId/mine", protect, getMyRating);

// PUT /api/ratings/:productId — rating edit karo
router.put(
  "/:productId",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video",  maxCount: 1 },
  ]),
  handleMediaUpload,
  updateRating
);

// DELETE /api/ratings/:productId — rating delete karo
router.delete("/:productId", protect, deleteRating);

module.exports = router;