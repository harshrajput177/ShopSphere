const SizeChart = require("../models/SizeChartModel");
const Product = require("../models/Product");
const asyncHandler = require("../Untils/asyncHandler");

const createSizeChart = asyncHandler(async (req, res) => {
  const { gender, productType, fields } = req.body;

  if (!gender || !productType || !fields?.length) {
    return res.status(400).json({
      success: false,
      message: "Gender, ProductType are required ❌",
    });
  }

  const existing = await SizeChart.findOne({ gender, productType });

  if (existing) {
    existing.fields = fields;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Size Chart updated",
      chart: existing,
    });
  }

  const chart = await SizeChart.create({ gender, productType, fields });

  res.status(201).json({
    success: true,
    message: "Size Chart create",
    chart,
  });
});

const getAllSizeCharts = asyncHandler(async (req, res) => {
  const charts = await SizeChart.find()
    .populate("gender", "name")
    .populate({
      path: "productType",
      select: "name subCategory",
      populate: {
        path: "subCategory",
        select: "name",
      },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: charts.length,
    charts,
  });
});

const getSizeChartByTypeAndGender = asyncHandler(async (req, res) => {
  const { productTypeId, genderId } = req.params;

  const chart = await SizeChart.findOne({
    productType: productTypeId,
    gender: genderId,
  })
    .populate("gender", "name")
    .populate("productType", "name");

  if (!chart) {
    return res.status(200).json({
      success: true,
      chart: null,
      fields: [],
    });
  }

  res.status(200).json({
    success: true,
    chart,
  });
});

const getSizeChartById = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findById(req.params.id)
    .populate("gender", "name")
    .populate("productType", "name");

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: "Size Chart not found",
    });
  }

  res.status(200).json({ success: true, chart });
});

const updateSizeChart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gender, productType, fields } = req.body;

  const duplicate = await SizeChart.findOne({
    gender,
    productType,
    _id: { $ne: id },
  });

  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: "Is Gender + ProductType Sizechart already exist  ❌",
    });
  }

  const updated = await SizeChart.findByIdAndUpdate(
    id,
    { gender, productType, fields },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Size Chart not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Size Chart updated",
    chart: updated,
  });
});

const deleteSizeChart = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findByIdAndDelete(req.params.id);

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: "Size Chart not found❌",
    });
  }

  res.status(200).json({
    success: true,
    message: "Size Chart deleted",
  });
});

const bulkUpdateSizeChart = asyncHandler(async (req, res) => {
  const { productTypeId, sizeChart } = req.body;

  if (!productTypeId) {
    return res.status(400).json({
      success: false,
      message: "productTypeId required ❌",
    });
  }

  if (!sizeChart || !Array.isArray(sizeChart)) {
    return res.status(400).json({
      success: false,
      message: "sizeChart array required ❌",
    });
  }

  const result = await Product.updateMany(
    { productType: productTypeId },
    { $set: { sizeChart: sizeChart } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} products updated`,
    modifiedCount: result.modifiedCount,
  });
});

const getProductCountByType = asyncHandler(async (req, res) => {
  const { productTypeId } = req.params;

  const count = await Product.countDocuments({ productType: productTypeId });

  res.status(200).json({ success: true, count });
});

module.exports = {
  createSizeChart,
  getAllSizeCharts,
  getSizeChartByTypeAndGender,
  getSizeChartById,
  updateSizeChart,
  deleteSizeChart,
  bulkUpdateSizeChart,
  getProductCountByType,
};