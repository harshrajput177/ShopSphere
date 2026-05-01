const SubCategory = require("../models/SubCategory");


// CREATE
const createSubCategory = async (req, res) => {
  try {
    const { name, category, gender } = req.body;

    const image = req.file?.path || "";

    const subCategory = await SubCategory.create({
      name,
      category,
      gender, // now Gender model ObjectId
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
      .populate("gender"); // important

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
    const { gender } = req.query; // gender id now

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

    let updateData = {
      name,
      category,
      gender // Gender ObjectId
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("category")
      .populate("gender");

    res.status(200).json({
      success: true,
      message: "SubCategory Updated Successfully",
      updated
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoryByCategory,
  updateSubCategory,
  deleteSubCategory
};