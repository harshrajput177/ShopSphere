const Product = require("../models/Product");
const asyncHandler = require("../Untils/asyncHandler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    shortDescription,
    discount,
    price,
    category,
    subCategory,
    productType,
    tags,
    collections,
    isBestSeller,
    isTrending,
    isNewArrival,
    isGenZ,
    specifications,
    occasion,
    gender 
  } = req.body;

  // ✅ BOOLEAN HELPER
  const toBool = (val) => val === "true" || val === true;

  // ✅ PARSE SAFE
  let parsedSpecifications = {};
  try {
    parsedSpecifications = JSON.parse(specifications || "{}");
  } catch {
    parsedSpecifications = {};
  }

  const parsedCollections = collections
    ? Array.isArray(collections) ? collections : [collections]
    : [];

  const parsedTags = tags
    ? Array.isArray(tags) ? tags : [tags]
    : [];
const parsedOccasion = occasion
  ? Array.isArray(occasion) ? occasion : [occasion]
  : [];

  // ✅ TAG LOGIC
  let finalTags = [...parsedTags];

  if (toBool(isBestSeller)) finalTags.push("Best Seller");
  if (toBool(isTrending)) finalTags.push("Trending");
  if (toBool(isNewArrival)) finalTags.push("New Arrival");
  if (toBool(isGenZ)) finalTags.push("GenZ");

  const numPrice = Number(price);
  const numDiscount = Number(discount);

  if (numPrice < 500) finalTags.push("Budget Pick");
  if (numDiscount > 30) finalTags.push("Hot Deal");

  finalTags = [...new Set(finalTags)];

  // 🔥 SLUG GENERATION
  let slug = slugify(title || "", {
    lower: true,
    strict: true
  });

  const existingSlug = await Product.findOne({ slug });

  if (existingSlug) {
    slug = slug + "-" + Date.now();
  }

  // 🔥 IMAGE MAP
  const imageMap = {};

  req.files?.forEach(file => {
    const match = file.fieldname.match(/variants\[(\d+)\]/);

    if (match) {
      const index = match[1];

      if (!imageMap[index]) {
        imageMap[index] = [];
      }

      imageMap[index].push(file.path);
    }
  });

  // 🔥 VARIANTS PARSE
  let finalVariants = [];

  if (req.body.variants) {
    const bodyVariants = Array.isArray(req.body.variants)
      ? req.body.variants
      : [req.body.variants];

    finalVariants = bodyVariants.map((v, i) => ({
      color: v.color,
      images: imageMap[i] || [],
      sizes: (v.sizes || []).map(s => ({
        size: s.size,
        stock: Number(s.stock),
        isOutOfStock: Number(s.stock) === 0
      }))
    }));
  }

  // ❌ VALIDATION
  if (!title || !price || !category || !subCategory || !productType) {
    return res.status(400).json({
      message: "Required fields missing ❌"
    });
  }

  if (finalVariants.length === 0) {
    return res.status(400).json({
      message: "Variants not received properly ❌"
    });
  }

  // ✅ CREATE PRODUCT
  const product = await Product.create({
    title,
    slug, // 🔥 IMPORTANT
    description,
    shortDescription,
    price,
    discount,
    category,
    subCategory,
    productType,
    collections: parsedCollections,
    tags: finalTags,
    isBestSeller: toBool(isBestSeller),
    isTrending: toBool(isTrending),
    isNewArrival: toBool(isNewArrival),
    isGenZ: toBool(isGenZ),
    specifications: parsedSpecifications,
    variants: finalVariants,
    occasion: parsedOccasion,
    gender,
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully 🚀",
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

const getHomeProducts = asyncHandler(async (req, res) => {

  const [
    bestSeller,
    newArrival,
    trending,
    clearance,
    genZ
  ] = await Promise.all([

    Product.find({ isBestSeller: true }).limit(10),
    Product.find({ isNewArrival: true }).limit(10),
    Product.find({ isTrending: true }).limit(10),

    // 🔥 Clearance = discount wale
    Product.find({ discount: { $gt: 30 } }).limit(10),

    // 🔥 GenZ
    Product.find({ isGenZ: true }).limit(10)

  ]);

  res.json({
    success: true,
    bestSeller,
    newArrival,
    trending,
    clearance,
    genZ
  });
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

  if (req.query.tag) {
    const tags = req.query.tag.split(",");
    query.tags = { $in: tags };
  }

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
  deleteProduct,
  getHomeProducts
};