

const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // ye hai?
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
  getProductsByOccasion
} = require("../controllers/ProductController");

// CREATE
router.post("/", upload.any(), createProduct);

router.get("/", getAllProducts);
router.get("/home", getHomeProducts);
router.get("/filter", getFilteredProducts);
router.get("/type/:productType", getProductsByProductType);
router.get("/:id", getSingleProduct);

// NEW:
router.put("/:id", upload.any(), updateProduct);

router.delete("/:id", deleteProduct);

router.get("/all-occasions", async (req, res) => {
  try {
    const products = await Product.find({}, "occasion"); // sirf occasion field

    const occasions = [...new Set(
      products.flatMap(p => p.occasion).filter(Boolean)
    )];

    res.json({ occasions });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// existing routes ke baad, lekin /:id se PEHLE add karo
router.get("/by-slug/:slug", async (req, res) => {
  try {

    const productType = await ProductType.findOne({ slug: req.params.slug });

    if (!productType) {
      return res.status(404).json({ error: "ProductType not found" });
    }

    const products = await Product.find({ productType: productType._id });

    // 3. Dynamic filters
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

router.get("/by-occasion/:occasion", getProductsByOccasion);

module.exports = router;