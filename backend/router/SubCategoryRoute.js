const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig");
const { createSubCategory, getSubCategories, getSubCategoryByCategory } = require("../Controller/SubCategory");

router.post("/", upload.single("image"), createSubCategory);
router.get("/", getSubCategories);
router.get("/category/:categoryId", getSubCategoryByCategory);

module.exports = router;