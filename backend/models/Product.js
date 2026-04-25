const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  // 🔹 BASIC INFO
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  shortDescription: {
    type: String
  },


  discount: {
    type: Number,
    default: 0
  },

  // 🔹 CATEGORY
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },

productType: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "ProductType",
  required: true
},

    gender: {
  type: String,
  enum: ["Men", "Women", "Kids", "Unisex"],
  required: true
},

  tags: [String],

  slug: {
  type: String,
  unique: true,
  required: true
},

  // 🔹 COLLECTIONS
  collections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection"
    }
  ],

  // 🔹 FLAGS
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isGenZ: { type: Boolean, default: false },

  // 🔹 SPECIFICATIONS
  specifications: {
    type: Map,
    of: String
  },

  occasion: {
  type: [String],
  enum: [
    "Casual",
    "Party",
    "Wedding",
    "Festive",
    "Travel",
    "Sports",
    "Office"
  ],
  default: []
},

  // 🔥 VARIANTS (MAIN SYSTEM)
  variants: [
    {
      color: {
        type: String,
        required: true
      },

      images: [
        {
          type: String
        }
      ],

        mainImage: String,

      // 🔥 NEW (IMPORTANT)
    sizes: [
  {
    size: String,
    stock: {
      type: Number,
      default: 0
    },
    price: {                // 🔥 ADD THIS
      type: Number,
      required: true
    },
    isOutOfStock: {
      type: Boolean,
      default: false
    }
  }
]
    }
  ],

  sold: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);