const sizeChartSchema = new mongoose.Schema({
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType"
  },

  fields: [
    {
      name: String // Chest, Waist, Length
    }
  ]
});

module.exports = mongoose.model("SizeChart", sizeChartSchema);