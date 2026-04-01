const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig");

const {
  createSubProductType,
  getAllSubProductTypes,
  getByProductType,
  deleteSubProductType
} = require("../Controller/SubProductType");

// ✅ CREATE (image + data)
router.post("/create", upload.single("image"), createSubProductType);

// GET ALL
router.get("/", getAllSubProductTypes);

// GET BY PRODUCT TYPE
router.get("/product-type/:productTypeId", getByProductType);

// DELETE
router.delete("/:id", deleteSubProductType);

module.exports = router;