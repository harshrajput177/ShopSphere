const ProductType = require("../models/ProductType");
const createProductType = async (req, res) => {
  try {
    // console.log("📥 BODY:", req.body);
    // console.log("📸 FILE:", req.file);

    const { name, subCategory , group} = req.body;

    console.log("NAME:", name);
console.log("SUBCATEGORY:", subCategory);
console.log("FILE:", req.file);

    if (!name || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const productType = await ProductType.create({
      name,
      subCategory,
      group,
      image: req.file.path
    });

    res.status(201).json({
      success: true,
      productType
    });

  } catch (error) {
  console.log("❌ ERROR MESSAGE:", error.message);
console.log("❌ FULL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET ALL PRODUCT TYPES
const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find()
      .populate("subCategory", "name");

    res.status(200).json({
      success: true,
      productTypes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getProductTypesBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const productTypes = await ProductType.find({
      subCategory: subCategoryId   // ✅ simple & clean
    });

    res.status(200).json({
      success: true,
      productTypes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ UPDATE PRODUCT TYPE
const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subCategory } = req.body;

    const productType = await ProductType.findById(id);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found"
      });
    }

    // update fields
    productType.name = name || productType.name;
    productType.subCategory = subCategory || productType.subCategory;

    // agar new image aayi hai
    if (req.file) {
      productType.image = req.file.path;
    }

    await productType.save();

    res.status(200).json({
      success: true,
      productType
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE PRODUCT TYPE
const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    await ProductType.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product Type deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProductType,
  getAllProductTypes,
  getProductTypesBySubCategory,
  deleteProductType,
    updateProductType
};