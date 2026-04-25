const mongoose = require("mongoose");
const Attribute = require("../models/AttributeModel");
const ProductType = require("../models/ProductType"); // 👈 IMPORTANT
const { allAttributes } = require("./data");

mongoose.connect("mongodb+srv://harshrajput30411_db_user:ClothSite369@cluster0.phsgqmg.mongodb.net/?appName=Cluster0");

const seed = async () => {
  try {
    await Attribute.deleteMany();

    for (const productTypeName in allAttributes) {
      const attrs = allAttributes[productTypeName];

      // 🔥 STEP 1: Find ProductType by name
      const productType = await ProductType.findOne({
        name: productTypeName
      });

      if (!productType) {
        console.log(`❌ ProductType not found: ${productTypeName}`);
        continue;
      }

      for (const attr of attrs) {
        await Attribute.create({
          name: attr.name,
          type: attr.type,
          options: attr.options || [],
          productTypes: [productType._id], // 👈 FIX
          isSize: attr.name?.toLowerCase().includes("size")
        });
      }
    }

    console.log("✅ Attributes Seeded Correctly");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();