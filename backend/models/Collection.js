const mongoose = require("mongoose");
const slugify = require("slugify");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    image: {
      type: String,
      required: [true, "Collection image is required"]
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// 🔥 AUTO SLUG
collectionSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true
    });
  }
  next();
});

// 🔍 SEARCH INDEX
collectionSchema.index({ name: "text" });

module.exports = mongoose.model("Collection", collectionSchema);