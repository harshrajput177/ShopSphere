const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: String,
    House: { type: mongoose.Schema.Types.Mixed, required:true},
    street: String,
    city:{ type: String, required: true },
    state: String,
    zipCode: { type: String, required: true },

    phone:{
       type:String,
       required:true,
    },

    shippingMethod: String,
    altPhone: String,
    couponCode: String,
    copyAddress: Boolean,
}, { timestamps: true });

module.exports = mongoose.model("Shipping", shippingSchema);
