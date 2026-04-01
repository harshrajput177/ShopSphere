const SubCategory = require("../models/SubCategory");
// const Product = require("../models/Product");
// ✅ CREATE SUBCATEGORY
const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const image = req.file?.path || "";

    const subCategory = await SubCategory.create({
      name,
      category,
      image
    });

    res.status(201).json({
      success: true,
      subCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ GET ALL SUBCATEGORIES (🔥 YE MISSING THA)
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category");

    res.status(200).json({
      success: true,
      subCategories   // ✅ ab proper key me bheja
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getSubCategoryByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId
    });

    res.status(200).json({
      success: true,
      subCategories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoryByCategory
};