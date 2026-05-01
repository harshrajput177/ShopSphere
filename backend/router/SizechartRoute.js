const express = require("express");
const router = express.Router();

const SizeChart = require("../models/SizeChartModel");


// CREATE SIZE CHART (ProductType + Gender Model Wise)
router.post("/create", async (req, res) => {
  try {
    const { gender, productType, fields } = req.body;

    if (!gender || !productType || !fields?.length) {
      return res.status(400).json({
        success: false,
        message: "Gender, Product Type and Fields are required"
      });
    }

    // duplicate check
    const existing = await SizeChart.findOne({
      gender,       // Gender ObjectId
      productType
    });

    if (existing) {
      existing.fields = fields;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Size Chart Updated Successfully ✅",
        chart: existing
      });
    }

    const chart = await SizeChart.create({
      gender,       // Gender ObjectId
      productType,
      fields
    });

    res.status(201).json({
      success: true,
      message: "Size Chart Created Successfully ✅",
      chart
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error ❌"
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    const charts = await SizeChart.find()
      .populate("gender", "name")
      .populate({
        path: "productType",
        select: "name subCategory",
        populate: {
          path: "subCategory",
          select: "name"
        }
      });

    res.status(200).json({
      success: true,
      charts
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error ❌"
    });
  }
});


// GET SIZE CHART BY PRODUCT TYPE + GENDER
router.get("/:productTypeId/:genderId", async (req, res) => {
  try {
    const { productTypeId, genderId } = req.params;

    const chart = await SizeChart.findOne({
      productType: productTypeId,
      gender: genderId // now Gender ObjectId
    })
      .populate("gender", "name")
      .populate("productType", "name");

    if (!chart) {
      return res.status(200).json({
        success: true,
        fields: []
      });
    }

    res.status(200).json({
      success: true,
      chart
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error ❌"
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { gender, productType, fields } = req.body;

    // duplicate check except current record
    const duplicate = await SizeChart.findOne({
      gender,
      productType,
      _id: { $ne: id }
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "This Size Chart already exists ❌"
      });
    }

    const updated = await SizeChart.findByIdAndUpdate(
      id,
      {
        gender,
        productType,
        fields
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Size Chart not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Size Chart Updated Successfully ✅",
      chart: updated
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error ❌"
    });
  }
});

module.exports = router;