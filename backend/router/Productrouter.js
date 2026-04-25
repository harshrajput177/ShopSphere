// 🔥 Product Route FIX

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
  getHomeProducts,
  getProductsByProductType
} = require("../Controller/ProductController");

// CREATE
router.post("/", upload.any(), createProduct);

router.get("/", getAllProducts);
router.get("/home", getHomeProducts);
router.get("/filter", getFilteredProducts);
router.get("/type/:productType", getProductsByProductType);
router.get("/:id", getSingleProduct);

// 🔥 IMPORTANT FIX
// OLD:
// router.put("/:id", updateProduct);

// NEW:
router.put("/:id", upload.any(), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;