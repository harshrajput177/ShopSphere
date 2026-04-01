const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig"); // ✅ add this

const {
  createProductType,
  getAllProductTypes,
  getProductTypesBySubCategory,
  deleteProductType
} = require("../Controller/ProductType");

// ✅ CREATE (image + data)
router.post("/create", upload.single("image"), createProductType);

// GET ALL
router.get("/", getAllProductTypes);

// GET BY SUBCATEGORY
router.get("/subcategory/:subCategoryId", getProductTypesBySubCategory);

// DELETE
router.delete("/:id", deleteProductType);

module.exports = router;