const SubCategory = require("../models/SubCategory");


// CREATE
const createSubCategory = async (req, res) => {
  try {
    const { name, category, gender } = req.body;

    const image = req.file?.path || "";

    const subCategory = await SubCategory.create({
      name,
      category,
      gender,
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


// GET ALL
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category")
      .populate("gender");

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


// GET BY CATEGORY + GENDER
const getSubCategoryByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { gender } = req.query;

    let filter = {
      category: categoryId
    };

    if (gender) {
      filter.gender = gender;
    }

    const subCategories = await SubCategory.find(filter)
      .populate("category")
      .populate("gender");

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


// ← NEW: GET BY GENDER (mobile nav ke liye)
const getSubCategoryByGender = async (req, res) => {
  try {
    const { genderId } = req.params;

    const subCategories = await SubCategory.find({ gender: genderId })
      .populate("category")
      .populate("gender");

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


// DELETE
const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// UPDATE
const updateSubCategory = async (req, res) => {
  try {
    const { name, category, gender } = req.body;

    const updateData = { name, category, gender };
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      subCategory
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


const getSubCategoryById = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id)
      .populate("gender", "name")
      .populate("category", "name");
    if (!sub) return res.status(404).json({ message: "Not found" });
    res.json({ subCategory: sub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoryByCategory,
  getSubCategoryByGender,   
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryById
};