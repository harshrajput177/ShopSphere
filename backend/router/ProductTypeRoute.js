const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig"); // ✅ add this

const {
  createProductType,
  getAllProductTypes,
  getProductTypesBySubCategory, 
  deleteProductType,
  updateProductType
} = require("../Controller/ProductType");

// ✅ CREATE (image + data)
router.post("/create", upload.single("image"), createProductType);

// GET ALL
router.get("/", getAllProductTypes);

// GET BY SUBCATEGORY
router.get("/subcategory/:subCategoryId", getProductTypesBySubCategory);

// ✅ UPDATE
router.put("/update/:id", upload.single("image"), updateProductType);

router.delete("/:id", deleteProductType);

module.exports = router;