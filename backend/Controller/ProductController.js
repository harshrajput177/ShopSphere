const Product = require("../models/Product");
const ProductType = require("../models/ProductType");
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

  // ✅ SAFE PARSE
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

  // 🔥 SLUG
  let slug = slugify(title || "", {
    lower: true,
    strict: true
  });

  const existingSlug = await Product.findOne({ slug });
  if (existingSlug) {
    slug = slug + "-" + Date.now();
  }

  // =====================================================
  // 🔥 IMAGE MAP (VERY IMPORTANT FIX)
  // =====================================================
  const imageMap = {};

  req.files?.forEach(file => {
    const match = file.fieldname.match(/variants\[(\d+)\]/);

    if (match) {
      const index = Number(match[1]);

      if (!imageMap[index]) {
        imageMap[index] = [];
      }

      imageMap[index].push(file.path);
    }
  });

  // =====================================================
  // 🔥 VARIANTS PARSE
  // =====================================================
  let bodyVariants = [];

  try {
    bodyVariants = JSON.parse(req.body.variants || "[]");
  } catch (err) {
    console.log("VARIANT PARSE ERROR:", err);
    bodyVariants = [];
  }

  // =====================================================
  // 🔥 FINAL VARIANTS (MAIN FIX)
  // =====================================================
  const finalVariants = bodyVariants.map((v, i) => {
    const uploadedImages = imageMap[i] || [];


    const mainIndex =
      v.mainImageIndex !== undefined && v.mainImageIndex !== null
        ? Number(v.mainImageIndex)
        : 0;

    return {
      color: String(v.color || "").replace(/"/g, ""), // 🔥 FIX
      images: uploadedImages,

      // 🔥 MAIN IMAGE (FINAL FIX)
      mainImage:
        uploadedImages[mainIndex] ||
        uploadedImages[0] ||
        "",

      sizes: (v.sizes || []).map(s => ({
        size: String(s.size || "").replace(/"/g, ""),
        stock: Number(s.stock),
        price: Number(s.price),
        isOutOfStock: Number(s.stock) === 0
      }))
    };
  });

    // console.log("FINAL VARIANTS", finalVariants);

  // =====================================================
  // ❌ VALIDATION
  // =====================================================
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


  const product = await Product.create({
    title,
    slug,
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
    gender
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully 🚀",
    product
  });
});


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

    Product.find({ isBestSeller: true })
      .sort({ createdAt: -1 })
      .limit(20),

    Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(20),

    Product.find({ isTrending: true })
      .sort({ createdAt: -1 })
      .limit(50),

    Product.find({ discount: { $gt: 30 } })
      .sort({ createdAt: -1 })
      .limit(20),

    Product.find({ isGenZ: true })
      .sort({ createdAt: -1 })
      .limit(20)

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
    .populate("collections")
    .populate("productType");
    

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});


const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let { variants, ...rest } = req.body;

  // ✅ BASIC FIELDS UPDATE
  Object.assign(product, rest);

  // =====================================================
  // 🔥 IMAGE MAP FOR NEW UPLOADED FILES
  // =====================================================
  const imageMap = {};

  req.files?.forEach((file) => {
    const match = file.fieldname.match(/variants\[(\d+)\]/);

    if (match) {
      const index = Number(match[1]);

      if (!imageMap[index]) {
        imageMap[index] = [];
      }

      imageMap[index].push(file.path);
    }
  });

  // =====================================================
  // 🔥 SAFE VARIANTS PARSE
  // =====================================================
  if (variants) {
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (err) {
        console.log("Variants Parse Error:", err);
        variants = [];
      }
    }

    if (!Array.isArray(variants)) {
      variants = [];
    }

    // =====================================================
    // 🔥 FINAL VARIANTS UPDATE
    // =====================================================
    product.variants = variants.map((v, i) => {
      const uploadedImages = imageMap[i] || [];

   const finalImages =
  uploadedImages.length > 0
    ? uploadedImages   // 🔥 new upload aaye toh old hata do
    : (v.images || []);

let finalMainImage =
  uploadedImages.length > 0
    ? uploadedImages[0]
    : (
        v.mainImage ||
        finalImages[0] ||
        ""
      );

 

      // agar selected main image new upload me hai
      if (!finalImages.includes(finalMainImage)) {
        finalMainImage = finalImages[0] || "";
      }

      return {
        color: v.color || "",
        images: finalImages,

        // ✅ MAIN IMAGE FIX
        mainImage: finalMainImage,

        sizes: (v.sizes || []).map((s) => ({
          size: s.size || "",
          stock: Number(s.stock || 0),
          price: Number(s.price || 0),
          isOutOfStock: Number(s.stock || 0) === 0
        }))
      };
    });
  }

  const updated = await product.save();

  res.json({
    success: true,
    message: "Product Updated Successfully 🚀",
    product: updated
  });
});



const getProductsByProductType = asyncHandler(async (req, res) => {
  const { productType } = req.params;

  // slug -> normal text
  const formattedType = productType
    .replace(/-/g, " ")
    .toLowerCase();

  // first find ProductType document
  const productTypeDoc = await ProductType.findOne({
    name: {
      $regex: new RegExp(`^${formattedType}$`, "i")
    }
  });

  if (!productTypeDoc) {
    return res.status(404).json({
      success: false,
      message: "Product Type not found"
    });
  }

  // now fetch products using ObjectId
  const products = await Product.find({
    productType: productTypeDoc._id
  })
    .populate("category")
    .populate("subCategory")
    .populate("productType");

  res.status(200).json(products);
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
  getHomeProducts,
  getProductsByProductType
};