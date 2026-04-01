const Product = require("../models/Product");
const asyncHandler = require("../Untils/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    shortDescription,
    price,
    category,
    subCategory,
    productType,
    collections,
    isBestSeller,
    isTrending,
    isNewArrival,
    isGenZ,
    specifications
  } = req.body;

  // 🔥 PARSE DATA
  const parsedSpecifications = JSON.parse(specifications || "{}");

  const parsedCollections = collections
    ? Array.isArray(collections)
      ? collections
      : [collections]
    : [];

  const toBool = (val) => val === "true" || val === true;

  // 🔥 CREATE PRODUCT
  const product = await Product.create({
    title,
    description,
    shortDescription,
    price,
    category,
    subCategory,
    productType,

    collections: parsedCollections,

    isBestSeller: toBool(isBestSeller),
    isTrending: toBool(isTrending),
    isNewArrival: toBool(isNewArrival),
    isGenZ: toBool(isGenZ),

    specifications: parsedSpecifications,

    images: {
      front: req.files?.front?.[0]?.path || "",
      thumbnails: req.files?.thumbnails?.map(f => f.path) || [],
      colors: req.files?.colors?.map(f => f.path) || []
    }
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product
  });
});


// ✅ GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .populate("subCategory")
    .populate("collections");

  res.json(products);
});

// ✅ FILTER PRODUCTS
const getFilteredProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    collection,
    isBestSeller,
    isTrending,
    isNewArrival,
    isGenZ
  } = req.query;

  let query = {};

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (collection) query.collections = collection;

  if (isBestSeller) query.isBestSeller = true;
  if (isTrending) query.isTrending = true;
  if (isNewArrival) query.isNewArrival = true;
  if (isGenZ) query.isGenZ = true;

  const products = await Product.find(query)
    .populate("category")
    .populate("subCategory")
    .populate("collections");

  res.json(products);
});

// ✅ GET SINGLE PRODUCT
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subCategory")
    .populate("collections");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// ✅ UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);

  const updated = await product.save();

  res.json({
    success: true,
    message: "Product Updated",
    product: updated
  });
});

// ✅ DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product Deleted"
  });
});

// 🔥 EXPORT ALL
module.exports = {
  createProduct,
  getAllProducts,
  getFilteredProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};