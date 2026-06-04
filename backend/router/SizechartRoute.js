const express = require("express");
const router = express.Router();
const {
  createSizeChart,
  getAllSizeCharts,
  getSizeChartByTypeAndGender,
  getSizeChartById,
  updateSizeChart,
  deleteSizeChart,
  bulkUpdateSizeChart,
  getProductCountByType,
} = require("../controllers/SizeChartController");

router.get("/all", getAllSizeCharts);
router.get("/count/:productTypeId", getProductCountByType);
router.get("/:id([0-9a-fA-F]{24})", getSizeChartById);
router.get("/:productTypeId/:genderId", getSizeChartByTypeAndGender);
router.post("/create", createSizeChart);
router.patch("/bulk", bulkUpdateSizeChart);
router.put("/update/:id", updateSizeChart);
router.delete("/:id", deleteSizeChart);

module.exports = router;