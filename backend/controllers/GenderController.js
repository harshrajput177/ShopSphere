const Gender = require("../models/GenderModel");


// CREATE
const createGender = async (req, res) => {
  try {
    const { name, category } = req.body;

    const image = req.file?.path || "";

    const gender = await Gender.create({
      name,
      category,
      image
    });

    res.status(201).json({
      success: true,
      gender
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL
const getGenders = async (req, res) => {
  try {
    const genders = await Gender.find()
      .populate("category");

    res.status(200).json({
      success: true,
      genders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET BY CATEGORY
const getGenderByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const genders = await Gender.find({
      category: categoryId
    });

    res.status(200).json({
      success: true,
      genders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE
const deleteGender = async (req, res) => {
  try {
    await Gender.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gender deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE
const updateGender = async (req, res) => {
  try {
    const { name, category } = req.body;

    let updateData = {
      name,
      category
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Gender.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate("category");

    res.status(200).json({
      success: true,
      message: "Gender updated successfully",
      updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createGender,
  getGenders,
  getGenderByCategory,
  updateGender,
  deleteGender
};