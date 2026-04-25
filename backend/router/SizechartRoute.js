const express = require("express");
const router = express.Router();
const SizeChart = require("../models/SizeChartModel");

// ✅ CREATE SIZE FIELDS
router.post("/create", async (req, res) => {
  const { productType, fields } = req.body;

  const chart = new SizeChart({ productType, fields });
  await chart.save();

  res.json(chart);
});

// ✅ GET BY PRODUCT TYPE
router.get("/:productTypeId", async (req, res) => {
  const chart = await SizeChart.findOne({
    productType: req.params.productTypeId
  });

  res.json(chart || { fields: [] });
});

module.exports = router;