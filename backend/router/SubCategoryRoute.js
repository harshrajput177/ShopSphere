const express = require("express");
const router = express.Router();

const upload = require("../Config/CloudConfig");
const { createSubCategory, getSubCategories, getSubCategoryByCategory, deleteSubCategory, updateSubCategory, getSubCategoryByGender, getSubCategoryById } = require("../controllers/SubCategory");

router.post("/", upload.single("image"), createSubCategory);
router.get("/", getSubCategories);
router.get("/category/:categoryId", getSubCategoryByCategory);
router.get("/gender/:genderId", getSubCategoryByGender);
router.delete("/:id", deleteSubCategory);
router.put("/:id", upload.single("image"), updateSubCategory);
router.get("/:id", getSubCategoryById);

module.exports = router;