const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig");

const {
  createProduct,
  getAllProducts,
  getFilteredProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../Controller/ProductController");

router.post(
  "/",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "thumbnails", maxCount: 5 },
    { name: "colors", maxCount: 4 }
  ]),
  createProduct
);

router.get("/", getAllProducts);
router.get("/filter", getFilteredProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
