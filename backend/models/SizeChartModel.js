const mongoose = require("mongoose");

const sizeChartSchema = new mongoose.Schema({
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType"
  },
  fields: [String] //["Chest","Length","Waist"]
});

module.exports = mongoose.model("SizeChart", sizeChartSchema);