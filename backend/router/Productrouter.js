const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig");

const {
  createProduct,
  getAllProducts,
  getFilteredProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getHomeProducts
} = require("../Controller/ProductController");

// 🔥 FIXED (dynamic fields support)
router.post("/", upload.any(), createProduct);

router.get("/", getAllProducts);
router.get("/home", getHomeProducts);
router.get("/filter", getFilteredProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;