const Collection = require("../models/Collection");

// ✅ CREATE COLLECTION
const createCollection = async (req, res) => {
  try {
    const { name, isFeatured, isActive } = req.body;

    const image = req.file?.path || "";

    const collection = await Collection.create({
      name,
      image,
      isFeatured,
      isActive
    });

    res.status(201).json({
      success: true,
      collection
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating collection"
    });
  }
};


// ✅ GET ALL COLLECTIONS
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      collections
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching collections"
    });
  }
};


// ✅ GET SINGLE COLLECTION
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found"
      });
    }

    res.status(200).json({
      success: true,
      collection
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching collection"
    });
  }
};


// ✅ DELETE COLLECTION
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Collection deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting collection"
    });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  deleteCollection
};