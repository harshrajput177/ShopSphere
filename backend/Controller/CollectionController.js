const Product = require("../models/Product");
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

// ✅ UPDATE COLLECTION
const updateCollection = async (req, res) => {
  try {
    const { name, isFeatured, isActive } = req.body;

    // existing collection
    const existing = await Collection.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Collection not found"
      });
    }

    // update data
    const updatedData = {
      name: name || existing.name,
      isFeatured:
        isFeatured !== undefined ? isFeatured : existing.isFeatured,
      isActive:
        isActive !== undefined ? isActive : existing.isActive,
      image: req.file ? req.file.path : existing.image
    };

    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      collection: updatedCollection
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating collection"
    });
  }
};


// Controller mein:
const getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const products = await Product.find({ collections: collection._id })
      .populate("productType", "name")
      .populate({
        path: "subCategory",
        populate: { path: "gender", select: "name" }
      });

    const colors = [...new Set(
      products.flatMap(p => p.variants.map(v => v.color).filter(Boolean))
    )];

    const occasions = [...new Set(
      products.flatMap(p => p.occasion || [])
    )];

    const sizes = [...new Set(
      products.flatMap(p =>
        p.variants.flatMap(v => v.sizes.map(s => String(s.size)))
      ).filter(Boolean)
    )];

    const productTypes = [...new Map(
      products
        .filter(p => p.productType)
        .map(p => [p.productType._id.toString(), p.productType.name])
    ).entries()].map(([id, name]) => ({ id, name }));

    const subCategories = [...new Set(
      products.map(p => p.subCategory?.name).filter(Boolean)
    )];

    const genders = [...new Set(
      products.map(p => p.subCategory?.gender?.name).filter(Boolean)
    )];

    const prices = products.flatMap(p =>
      p.variants.flatMap(v => v.sizes.map(s => s.price))
    ).filter(Boolean);

    const filterMeta = {
      colors,
      occasions,
      sizes,
      productTypes,
      subCategories,  
      genders,        
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 10000,
      },
      flags: [
        { key: "isTrending", label: "Trending" },
        { key: "isBestSeller", label: "Bestseller" },
        { key: "isNewArrival", label: "New Arrival" },
      ]
    };

    res.json({ collection, products, filterMeta });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  DELETE COLLECTION
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
  deleteCollection,
  updateCollection,
  getCollectionBySlug
};