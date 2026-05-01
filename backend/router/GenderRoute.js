const express = require("express");
const router = express.Router();

const {
  createGender,
  getGenders,
  getGenderByCategory,
  updateGender,
  deleteGender
} = require("../Controller/GenderController");

const upload = require("../Config/CloudConfig");


router.post("/", upload.single("image"), createGender);

router.get("/", getGenders);

router.get("/category/:categoryId", getGenderByCategory);

router.put("/:id", upload.single("image"), updateGender);

router.delete("/:id", deleteGender);

module.exports = router;