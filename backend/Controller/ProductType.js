const ProductType = require("../models/ProductType");

const createProductType = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📸 FILE:", req.file);

    const { name, subCategory } = req.body;

    if (!name || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const productType = await ProductType.create({
      name,
      subCategory,
      image: req.file ? req.file.path : ""
    });

    res.status(201).json({
      success: true,
      productType
    });

  } catch (error) {
    console.log("❌ ERROR:", error);
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


// ✅ GET PRODUCT TYPES BY SUBCATEGORY
const getProductTypesBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;


    const productTypes = await ProductType.find({
      subCategory: subCategoryId
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
  deleteProductType
};