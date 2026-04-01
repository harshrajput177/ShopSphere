const express = require("express");
const router = express.Router();

const {
  createCollection,
  getCollections,
  getCollectionById,
  deleteCollection
} = require("../Controller/CollectionController");

const upload = require("../Config/CloudConfig");

// ✅ CREATE COLLECTION (IMAGE UPLOAD)
router.post("/create", upload.single("image"), createCollection);

// ✅ GET ALL
router.get("/", getCollections);

// ✅ GET SINGLE
router.get("/:id", getCollectionById);

// ✅ DELETE
router.delete("/:id", deleteCollection);

module.exports = router;