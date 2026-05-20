const express = require("express");
const router = express.Router();
const upload = require("../Config/CloudConfig");
const { createCategory, getCategories } = require("../controllers/CategoryController");

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);

module.exports = router;