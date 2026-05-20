const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const image = req.file?.path || "";

    const category = await Category.create({
      name,
      image
    });

    res.status(201).json({
      success: true,
      category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories   // ✅ ab frontend ke hisaab se
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createCategory , getCategories};