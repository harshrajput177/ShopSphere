const mongoose = require("mongoose");
const Attribute = require("../models/AttributeModel");
const { allAttributes } = require("./data");

mongoose.connect("mongodb+srv://harshrajput30411_db_user:ClothSite369@cluster0.phsgqmg.mongodb.net/?appName=Cluster0");

const seed = async () => {
  try {
    await Attribute.deleteMany();

    for (const productType in allAttributes) {
      const attrs = allAttributes[productType];

      if (!Array.isArray(attrs)) continue;

      for (const attr of attrs) {
        await Attribute.create({
          name: attr.name,
          type: attr.type,
          options: attr.options || [],
          productTypeName: productType,
          isSize: attr.name?.toLowerCase().includes("size")
        });
      }
    }

    console.log("✅ Attributes Seeded");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();