const SubProductType = require("../models/SubProductType");

// ✅ CREATE
const createSubProductType = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📸 FILE:", req.file);

    const { name, productType, collection } = req.body;

    if (!name || !productType || !collection) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const subProductType = await SubProductType.create({
      name: name.trim(),
      productType,
      collection,
      image: req.file ? req.file.path : ""
    });

    res.status(201).json({
      success: true,
      message: "SubProductType created successfully",
      subProductType
    });

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllSubProductTypes = async (req, res) => {
  try {
    const { productType } = req.query;

    let filter = {};

    if (productType) {
      filter.productType = productType;
    }

    const data = await SubProductType.find(filter)
      .populate("productType")
      .populate("collection");

    res.json({
      success: true,
      subProductTypes: data
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ GET BY PRODUCT TYPE
const getByProductType = async (req, res) => {
  try {
    const { productTypeId } = req.params;

    const data = await SubProductType.find({ productType: productTypeId })
      .populate("collection");

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ DELETE
const deleteSubProductType = async (req, res) => {
  try {
    await SubProductType.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSubProductType,
  getAllSubProductTypes,
  getByProductType,
  deleteSubProductType
};