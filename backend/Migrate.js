require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./Config/CloudConfig");
const Product = require("./models/ProductSchema");
const path = require("path");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

const migrateImages = async () => {
  try {
  const products = await Product.find();
for (let p of products) {
  console.log(p.name, "=>", p.image);
}


 for (let product of products) {
  if (product.image && !product.image.includes("cloudinary.com")) {
    const imageFileName = product.image.replace(/^uploads[\\/]/, "");
    const localImagePath = path.join(__dirname, "uploads", imageFileName); // ⬅️ no ".."

    if (fs.existsSync(localImagePath)) {
      console.log("📤 Uploading:", localImagePath);

      const result = await cloudinary.uploader.upload(localImagePath, {
        folder: "products",
      });

      product.image = result.secure_url;
      await product.save();

      console.log(`✅ Uploaded: ${product.name}`);
    } else {
      console.warn(`⚠️ Image not found, skipping: ${localImagePath}`);
    }
  }
}


    console.log("🎉 All images migrated to Cloudinary!");
    process.exit();
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateImages();
