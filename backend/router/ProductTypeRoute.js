const express = require("express");
const router = express.Router();
const ProductType = require("../models/ProductType");
const upload = require("../Config/CloudConfig"); // ✅ add this

const {
  createProductType,
  getAllProductTypes,
  getProductTypesBySubCategory, 
  deleteProductType,
  updateProductType
} = require("../Controller/ProductType");

// ✅ CREATE (image + data)
router.post("/create", upload.single("image"), createProductType);

// GET ALL
router.get("/", getAllProductTypes);

// GET BY SUBCATEGORY
router.get("/subcategory/:subCategoryId", getProductTypesBySubCategory);

// ✅ UPDATE
router.put("/update/:id", upload.single("image"), updateProductType);

router.delete("/:id", deleteProductType);

// migrate-slugs route update karo
router.get("/migrate-slugs", async (req, res) => {
  try {
    const productTypes = await ProductType.find({
      $or: [{ slug: { $exists: false } }, { slug: null }]
    }).populate({
      path: "subCategory",
      select: "name",
      populate: {
        path: "gender",      // 🔥 gender bhi populate karo
        select: "name"
      }
    });

    for (const pt of productTypes) {
      const subCatName = pt.subCategory?.name || "general";
      const genderName = pt.subCategory?.gender?.name || "";

      // "jeans-western-wear-men", "jeans-ethnic-wear-women"
      const slug = `${pt.name}-${subCatName}-${genderName}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      await ProductType.updateOne(
        { _id: pt._id },
        { $set: { slug } }
      );
    }

    res.json({
      success: true,
      message: `${productTypes.length} ProductTypes updated with slugs`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ek baar run karo — index drop karna ke liye
router.get("/clear-slugs", async (req, res) => {
  try {
    await ProductType.updateMany({}, { $unset: { slug: "" } });
    res.json({ success: true, message: "All slugs cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;