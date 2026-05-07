const mongoose = require("mongoose");

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String },
    group: {
      type: String,
      enum: ["Topwear", "Bottomwear", "Innerwear", "Co-ord Set", "OnePiece", "Outerwear", "Other"],
      required: true
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },
    slug: {
      type: String,
      sparse: true
    }
  },
  { timestamps: true }
);

productTypeSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

productTypeSchema.index({ name: 1, subCategory: 1 }, { unique: true });

module.exports = mongoose.model("ProductType", productTypeSchema);