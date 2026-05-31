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
  } = req.body;

  // BOOLEAN HELPER
  const toBool = (val) => val === "true" || val === true;


  // specifications parse karne ke baad ye add karo
let parsedSpecifications = {};
try {
  const raw = JSON.parse(specifications || "{}");
  // Extra quotes aur spaces clean karo
  Object.keys(raw).forEach(key => {
    parsedSpecifications[key] = String(raw[key])
      .replace(/^"+|"+$/g, "")  // leading/trailing quotes hatao
      .trim();
  });
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

  // TAG LOGIC
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

  //  SLUG
  let slug = slugify(title || "", {
    lower: true,
    strict: true
  });

  const existingSlug = await Product.findOne({ slug });
  if (existingSlug) {
    slug = slug + "-" + Date.now();
  }

  //  IMAGE MAP (VERY IMPORTANT FIX)
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

  //  VARIANTS PARSE
  let bodyVariants = [];

  try {
    bodyVariants = JSON.parse(req.body.variants || "[]");
  } catch (err) {
    console.log("VARIANT PARSE ERROR:", err);
    bodyVariants = [];
  }

  //  FINAL VARIANTS (MAIN FIX)

  const finalVariants = bodyVariants.map((v, i) => {
    const uploadedImages = imageMap[i] || [];


    const mainIndex =
      v.mainImageIndex !== undefined && v.mainImageIndex !== null
        ? Number(v.mainImageIndex)
        : 0;

    return {
      color: String(v.color || "").replace(/"/g, ""), // 🔥 FIX
      images: uploadedImages,

      // MAIN IMAGE (FINAL FIX)
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

  // VALIDATION

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
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully 🚀",
    product
  });
});


//  GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()

    // Category
    .populate("category")

    // Product -> ProductType -> SubCategory -> Gender
    .populate({
      path: "productType",
      populate: {
        path: "subCategory",
        populate: {
          path: "gender",
          select: "name image"
        }
      }
    })

    // Direct SubCategory (optional but useful)
    .populate({
      path: "subCategory",
      populate: {
        path: "gender",
        select: "name image"
      }
    })

    .populate("collections");

  res.json(products);
});

const getHomeProducts = asyncHandler(async (req, res) => {
  const populateProductType = {
    path: "productType",
    populate: {
      path: "subCategory",
      populate: {
        path: "gender",
        select: "name image"
      }
    }
  };

  const populateSubCategory = {
    path: "subCategory",
    populate: {
      path: "gender",
      select: "name image"
    }
  };

  const [
    bestSeller,
    newArrival,
    trending,
    clearance,
    genZ
  ] = await Promise.all([

    Product.find({ isBestSeller: true })
      .populate("category")
      .populate(populateSubCategory)
      .populate(populateProductType)
      .sort({ updatedAt: -1 })
      .limit(20),

    Product.find({ isNewArrival: true })
      .populate("category")
      .populate(populateSubCategory)
      .populate(populateProductType)
      .sort({ updatedAt: -1 })
      .limit(20),

    Product.find({ isTrending: true })
      .populate("category")
      .populate(populateSubCategory)
      .populate(populateProductType)
      .sort({ updatedAt: -1 })
      .limit(50),

    Product.find({ discount: { $gt: 30 } })
      .populate("category")
      .populate(populateSubCategory)
      .populate(populateProductType)
      .sort({ updatedAt: -1 })
      .limit(20),

    Product.find({ isGenZ: true })
      .populate("category")
      .populate(populateSubCategory)
      .populate(populateProductType)
      .sort({ updatedAt: -1 })
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
//  FILTER PRODUCTS
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


// GET SINGLE PRODUCT
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")

    // subCategory + gender
    .populate({
      path: "subCategory",
      populate: {
        path: "gender",
        select: "name image"
      }
    })

    // productType + subCategory + gender
    .populate({
      path: "productType",
      populate: {
        path: "subCategory",
        populate: {
          path: "gender",
          select: "name image"
        }
      }
    })

    .populate("collections");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

const getProductsByOccasion = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    occasion: req.params.occasion 
  })
  .populate("productType", "name")
  .populate({
    path: "subCategory",
    populate: { path: "gender", select: "name" }
  });

  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }
  //  SubCategory — Ethnic, Western etc.
  const subCategories = [...new Set(
    products.map(p => p.subCategory?.name).filter(Boolean)
  )];

  //  Gender — Men, Women etc.
  const genders = [...new Set(
    products.map(p => p.subCategory?.gender?.name).filter(Boolean)
  )];
  
  const colors = [...new Set(
    products.flatMap(p => p.variants.map(v => v.color).filter(Boolean))
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


  const prices = products.flatMap(p =>
    p.variants.flatMap(v => v.sizes.map(s => s.price))
  ).filter(Boolean);

  const filterMeta = {
    colors,
    sizes,
    productTypes,
    subCategories,  
    genders,        
    occasions: [],
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

  res.json({ products, filterMeta });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let { variants, ...rest } = req.body;

  //  BASIC FIELDS UPDATE
  Object.assign(product, rest);

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

    //FINAL VARIANTS UPDATE
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

        // MAIN IMAGE FIX
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

  console.log(
  JSON.stringify(product.variants, null, 2)
);

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

const searchSuggest = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json({ suggestions: [] });

    const products = await Product.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            should: [
              { autocomplete: { query: q, path: "title", fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
              { text: { query: q, path: "productTypeName", fuzzy: { maxEdits: 1 }, score: { boost: { value: 2 } } } },
              { text: { query: q, path: "subCategoryName", fuzzy: { maxEdits: 1 } } }
            ],
            minimumShouldMatch: 1
          }
        }
      },
      { $limit: 30 },
      {
        $project: {
          title:           1,
          genderName:      1,
          productTypeName: 1,
          subCategoryName: 1,
          variants:        { $slice: ["$variants", 1] },  // sirf pehla variant
          _id:             1
        }
      }
    ]);

    const qLower = q.toLowerCase();
    const keywordMap  = new Map();
    const categoryMap = new Map();
    const productList = [];

    products.forEach((p) => {
      const gender      = (p.genderName      || "").trim();
      const productType = (p.productTypeName || "").trim();
      const subCat      = (p.subCategoryName || "").trim();
      const img         = p.variants?.[0]?.images?.[0] || null;
      const price       = p.variants?.[0]?.sizes?.[0]?.price || null;

      // keyword: "Cargo Pants for Men"
      if (productType && gender) {
        const key = `${productType} for ${gender}`;
        if (!keywordMap.has(key))
          keywordMap.set(key, { text: key, type: "keyword", meta: gender });
      }

      // category: "Western Wear › Cargo Pants"
      if (subCat && productType) {
        const key = `${subCat} › ${productType}`;
        if (!categoryMap.has(key))
          categoryMap.set(key, { text: key, type: "category", meta: gender });
      }

      // products (title match wale top 4)
      if (productList.length < 4 && p.title?.toLowerCase().includes(qLower)) {
        productList.push({
          type:  "product",
          text:  p.title,
          id:    p._id,
          image: img,
          price: price ? `₹${price}` : null,
          meta:  `${gender} · ${subCat || productType}`
        });
      }
    });

    const suggestions = [
      ...[...keywordMap.values()].slice(0, 3),
      ...[...categoryMap.values()].slice(0, 2),
      ...productList
    ];

    res.json({ suggestions });
  } catch (err) {
    console.error("Suggest error:", err.message);
    res.json({ suggestions: [] });
  }
};

const normalizeWord = (word) => {
  const w = word.toLowerCase().replace(/[''`]/g, "");
  const stemMap = {
    // Gender
    "woman": "Women", "womens": "Women", "women": "Women",
    "man": "Men", "mens": "Men", "men": "Men",
    "girls": "Kids", "girl": "Kids", "boys": "Kids",
    "boy": "Kids", "kids": "Kids", "kid": "Kids", "children": "Kids",
    // Clothing
    "pants": "pant", "pant": "pant",
    "jeans": "jean", "jean": "jean", "denim": "jean",
    "cargos": "cargo", "cargo": "cargo",
    "shirts": "shirt", "shirt": "shirt",
    "tops": "top", "top": "top",
    "dresses": "dress", "dress": "dress",
    "shorts": "short", "short": "short",
    "skirts": "skirt", "skirt": "skirt",
    "sarees": "saree", "saree": "saree", "sari": "saree",
    "kurtis": "kurti", "kurti": "kurti",
    "tshirts": "tshirt", "tshirt": "tshirt",
    "t-shirt": "tshirt", "t-shirts": "tshirt",
    "leggings": "legging", "legging": "legging",
    "joggers": "jogger", "jogger": "jogger",
    "hoodies": "hoodie", "hoodie": "hoodie",
    "sweaters": "sweater", "sweater": "sweater",
    "blazers": "blazer", "blazer": "blazer",
    "jackets": "jacket", "jacket": "jacket",
    "suits": "suit", "suit": "suit",
    "gowns": "gown", "gown": "gown",
    "kurtas": "kurta", "kurta": "kurta",
    "shoes": "shoe", "shoe": "shoe",
    "boots": "boot", "boot": "boot",
    "sandals": "sandal", "sandal": "sandal",
  };
  return stemMap[w] || w;
};

const searchProducts = async (req, res) => {
  try {
    const { q, limit = 100 } = req.query;
    if (!q?.trim()) return res.json({ products: [], total: 0 });

        const SearchLog = require("../models/SearchLog");
    await SearchLog.create({ query: q.toLowerCase().trim() });

    const genderValues = ["Men", "Women", "Kids"];

const rawWords = q.trim().split(/\s+/);

// "for", "and", "the" jaise stop words hata do
const stopWords = new Set(["for", "and", "the", "a", "an", "of", "in"]);
const filteredWords = rawWords.filter(w => !stopWords.has(w.toLowerCase()));

const normalizedWords = [...new Set(filteredWords.map(normalizeWord))];

    // Gender aur product words alag karo
    const genderWords  = normalizedWords.filter(w => genderValues.includes(w));
    const productWords = normalizedWords.filter(w => !genderValues.includes(w));

    const mustClauses = [];

    // Product words — title + productTypeName + subCategoryName mein search
    productWords.forEach(word => {
      mustClauses.push({
        compound: {
          should: [
            {
              text: {
                query: word,
                path: "title",
                fuzzy: { maxEdits: 1, prefixLength: 2 },
                score: { boost: { value: 3 } }
              }
            },
            {
              autocomplete: {
                query: word,
                path: "title",
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              text: {
                query: word,
                path: "productTypeName",
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 2 } }
              }
            },
            {
              text: {
                query: word,
                path: "subCategoryName",
                fuzzy: { maxEdits: 1 }
              }
            }
          ],
          minimumShouldMatch: 1
        }
      });
    });

    // Gender — genderName field pe exact match
    genderWords.forEach(gender => {
      mustClauses.push({
        text: {
          query: gender,
          path: "genderName"
        }
      });
    });

    // Agar koi clause nahi toh basic search
    const searchQuery = mustClauses.length > 0
      ? { compound: { must: mustClauses } }
      : {
          compound: {
            should: [
              {
                text: {
                  query: q,
                  path: "title",
                  fuzzy: { maxEdits: 1, prefixLength: 2 }
                }
              },
              {
                autocomplete: {
                  query: q,
                  path: "title",
                  fuzzy: { maxEdits: 1 }
                }
              }
            ],
            minimumShouldMatch: 1
          }
        };

    const rawProducts = await Product.aggregate([
      { $search: { index: "default", ...searchQuery } },
      { $addFields: { score: { $meta: "searchScore" } } },
      { $sort: { score: -1 } },
      { $limit: Number(limit) }
    ]);

    const ids = rawProducts.map(p => p._id);
    const products = await Product.find({ _id: { $in: ids } })
      .populate("productType")
      .populate({
        path: "subCategory",
        populate: { path: "gender" }
      })
      .lean();

    const scoreMap = Object.fromEntries(
      rawProducts.map(p => [p._id.toString(), p.score])
    );

    products.sort(
      (a, b) => (scoreMap[b._id.toString()] || 0) - (scoreMap[a._id.toString()] || 0)
    );

    const colors = [...new Set(
      products.flatMap(p => p.variants?.map(v => v.color).filter(Boolean))
    )];
    const sizes = [...new Set(
      products.flatMap(p =>
        p.variants?.flatMap(v => v.sizes?.map(s => String(s.size))) || []
      )
    )];
    const prices = products.flatMap(p =>
      p.variants?.flatMap(v => v.sizes?.map(s => Number(s.price))) || []
    ).filter(Boolean);

    res.json({
      products,
      total: products.length,
      filterMeta: {
        colors,
        sizes,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 10000,
      }
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};


// EXPORT ALL
module.exports = {
  createProduct,
  getAllProducts,
  getFilteredProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getHomeProducts,
  getProductsByProductType,
  getProductsByOccasion,
  searchSuggest, 
  searchProducts
};