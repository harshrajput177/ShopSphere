const express = require("express");
const router = express.Router();

const {
  createCollection,
  getCollections,
  getCollectionById,
  deleteCollection,
  updateCollection,
  getCollectionBySlug
} = require("../controllers/CollectionController");

const upload = require("../Config/CloudConfig");


router.post("/create", upload.single("image"), createCollection);


router.get("/", getCollections);

router.get("/:slug", getCollectionBySlug);

router.get("/:id", getCollectionById);

router.put("/update/:id", upload.single("image"), updateCollection);


router.delete("/:id", deleteCollection);

module.exports = router;