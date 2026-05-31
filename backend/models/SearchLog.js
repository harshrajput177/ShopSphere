const mongoose = require("mongoose");
const SearchLogSchema = new mongoose.Schema({
  query:     { type: String, required: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now, expires: "30d" } 
});
module.exports = mongoose.model("SearchLog", SearchLogSchema);