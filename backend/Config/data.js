// cleanSpecs.js — ek baar run karo: node cleanSpecs.js
const mongoose = require("mongoose");
const Product = require("../models/Product");

mongoose.connect("mongodb+srv://harshrajput30411_db_user:ClothSite369@cluster0.phsgqmg.mongodb.net/?appName=Cluster0").then(async () => {
  const products = await Product.find({});
  
  for (const product of products) {
    let changed = false;
    const cleanedSpecs = {};
    
    if (product.specifications) {
      for (const [key, value] of product.specifications) {
        const cleaned = String(value).replace(/^"+|"+$/g, "").trim();
        cleanedSpecs[key] = cleaned;
        if (cleaned !== value) changed = true;
      }
    }
    
    if (changed) {
      product.specifications = cleanedSpecs;
      await product.save();
      console.log(`Fixed: ${product.title}`);
    }
  }
  
  console.log("Done ✅");
  mongoose.disconnect();
});