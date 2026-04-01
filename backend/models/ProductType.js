const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String // cloudinary URL
    },

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("ProductType", productTypeSchema);