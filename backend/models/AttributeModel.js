
const mongoose = require("mongoose");
const attributeSchema = new mongoose.Schema({
  name: String, // Fabric, Size, Pattern
  type: String, // text | select | number
  options: [String], // ["S","M","L"]
  productTypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType"
    }
  ],
  isSize: { type: Boolean, default: false } // 👈 important
});


module.exports = mongoose.model("Attribute", attributeSchema);