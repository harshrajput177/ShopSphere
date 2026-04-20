const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String // cloudinary URL
    },

    group: {
        type: String,
        enum: ["Topwear", "Bottomwear", "Innerwear", "Combo", "OnePiece","Outerwear", "other"],
        required: true
    },

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    }


}, { timestamps: true });

module.exports = mongoose.model("ProductType", productTypeSchema);