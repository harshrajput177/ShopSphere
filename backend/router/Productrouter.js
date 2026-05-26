const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ProductType = require("../models/ProductType");
const upload = require("../Config/CloudConfig");

const {
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
} = require("../controllers/ProductController");


// ─────────────────────────────────────────────────────────
// ✅ ALL SPECIFIC ROUTES MUST COME BEFORE  /:id
// ─────────────────────────────────────────────────────────

// Search
router.get("/search/suggest", searchSuggest);
router.get("/search",         searchProducts);

// Static named routes
router.get("/home",           getHomeProducts);
router.get("/filter",         getFilteredProducts);

// All occasions list
router.get("/all-occasions", async (req, res) => {
  try {
    const products = await Product.find({}, "occasion");
    const occasions = [...new Set(
      products.flatMap(p => p.occasion).filter(Boolean)
    )];
    res.json({ occasions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// By slug (productType slug)  ← was after /:id — FIXED
router.get("/by-slug/:slug", async (req, res) => {
  try {
    const productType = await ProductType.findOne({ slug: req.params.slug });

    if (!productType) {
      return res.status(404).json({ error: "ProductType not found for slug: " + req.params.slug });
    }

    const products = await Product.find({ productType: productType._id })
      .populate("subCategory")
      .populate("productType");

    const colors = [...new Set(
      products.flatMap(p => p.variants.map(v => v.color)).filter(Boolean)
    )];

    const occasions = [...new Set(
      products.flatMap(p => p.occasion).filter(Boolean)
    )];

    const prices = products
      .flatMap(p => p.variants.flatMap(v => v.sizes.map(s => s.price)))
      .filter(Boolean);

    res.json({
      productType,
      products,
      filterMeta: {
        colors,
        occasions,
        priceRange: {
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : 10000
        }
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// By occasion  ← was after /:id — FIXED
router.get("/by-occasion/:occasion", getProductsByOccasion);

// By subcategory (new — for MegaMenu fallback)
router.get("/by-subcategory/:subCategoryId", async (req, res) => {
  try {
    const products = await Product.find({ subCategory: req.params.subCategoryId })
      .populate("subCategory")
      .populate("productType");

    const colors = [...new Set(
      products.flatMap(p => p.variants.map(v => v.color)).filter(Boolean)
    )];

    const occasions = [...new Set(
      products.flatMap(p => p.occasion).filter(Boolean)
    )];

    const prices = products
      .flatMap(p => p.variants.flatMap(v => v.sizes.map(s => s.price)))
      .filter(Boolean);

    res.json({
      products,
      filterMeta: {
        colors,
        occasions,
        priceRange: {
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : 10000
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// By productType id
router.get("/type/:productType", getProductsByProductType);

// Debug routes
router.get("/update-search-fields", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("productType")
      .populate({ path: "subCategory", populate: { path: "gender" } })
      .lean();

    let updated = 0;
    for (const p of products) {
      const genderName      = p.subCategory?.gender?.name || "";
      const productTypeName = p.productType?.name || "";
      const subCategoryName = p.subCategory?.name || "";

      const result = await Product.updateOne(
        { _id: p._id },
        { $set: { genderName, productTypeName, subCategoryName } }
      );
      if (result.modifiedCount > 0) updated++;
    }
    res.json({ ok: true, updated, total: products.length });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

router.get("/debug-product", async (req, res) => {
  try {
    const p = await Product.findOne().lean();
    res.json({
      title:           p.title,
      genderName:      p.genderName,
      productTypeName: p.productTypeName,
      subCategoryName: p.subCategoryName
    });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// ⚠️  DYNAMIC /:id ROUTES — ALWAYS LAST
// ─────────────────────────────────────────────────────────

router.get("/",    getAllProducts);
router.post("/",   upload.any(), createProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", upload.any(), updateProduct);
router.delete("/:id", deleteProduct);


module.exports = router;