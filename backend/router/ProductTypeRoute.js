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
} = require("../controllers/ProductType");


router.post("/create", upload.single("image"), createProductType);


router.get("/", getAllProductTypes);


router.get("/subcategory/:subCategoryId", getProductTypesBySubCategory);


router.put("/update/:id", upload.single("image"), updateProductType);

router.delete("/:id", deleteProductType);

router.get("/migrate-slugs", async (req, res) => {
  try {
    const productTypes = await ProductType.find({
      $or: [{ slug: { $exists: false } }, { slug: null }]
    }).populate({
      path: "subCategory",
      select: "name",
      populate: {
        path: "gender",    
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

router.get("/clear-slugs", async (req, res) => {
  try {
    await ProductType.updateMany({}, { $unset: { slug: "" } });
    res.json({ success: true, message: "All slugs cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;