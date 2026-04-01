// const mongoose = require("mongoose");
// const { Parser } = require("json2csv");
// const fs = require("fs");

// // ✅ Step 1: Connect to MongoDB
// mongoose.connect("mongodb+srv://harshrajput30411:IshumDatabasebyHarsh@ishum.tlzws.mongodb.net/?retryWrites=true&w=majority&appName=Ishum", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Step 2: Define Product Schema (based on your sample)
// const productSchema = new mongoose.Schema({
//   name: String,
//   category: String,
//   subcategory: String,
//   image: String,
//   colorImages: [String],
//   price: Number,
//   discount: Number,
//   description: String,
//   size: [String],
//   color: String,
//   collectionName: String,
//   isBestseller: Boolean,
//   isExclusive: Boolean,
//   isIshumStore: Boolean,
//   availability: Boolean,
//   createdAt: Date,
//   updatedAt: Date
// }, { collection: 'products' }); // replace with your actual collection name

// const Product = mongoose.model("Product", productSchema);

// // ✅ Step 3: Fetch and Export
// async function exportToCSV() {
//   try {
//     const products = await Product.find().lean();

//     if (products.length === 0) {
//       console.log("⚠️ No products found in database.");
//       return;
//     }

//     // Format array fields
//     const formattedProducts = products.map(p => ({
//       ...p,
//       thumbnails: (p.thumbnails || []).join(', '),
//       colorImages: (p.colorImages || []).join(', '),
//       size: (p.size || []).join(', ')
//     }));

//     const fields = Object.keys(formattedProducts[0]);
//     const json2csvParser = new Parser({ fields });
//     const csv = json2csvParser.parse(formattedProducts);

//     fs.writeFileSync("product.csv", csv);
//     console.log("✅ CSV file 'product.csv' created successfully!");
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("❌ Error exporting data:", error);
//   }
// }

// exportToCSV();





const mongoose = require("mongoose");
const fs = require("fs");
const { Parser } = require("json2csv");

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://harshrajput30411:IshumDatabasebyHarsh@ishum.tlzws.mongodb.net/?retryWrites=true&w=majority&appName=Ishum", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  subcategory: String,
  price: Number,
  discount: Number,
  description: String,
  size: [String],
  color: String,
  collectionName: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'products' });

const Product = mongoose.model("Product", productSchema);

// ✅ Export to CSV
async function exportToCSV() {
  try {
    const products = await Product.find().lean();

    if (products.length === 0) {
      console.log("⚠️ No products found in database.");
      return;
    }

    // Format array fields into string
    const formattedProducts = products.map(p => ({
     _id: p._id.toString(),
  name: p.name,
  slug: `https://domain.com/${p.slug}`, // ✅ Full URL format
  category: p.category,
  subcategory: p.subcategory,
  image: `Click on Slug for seen image`,
  price: p.price,
  discount: p.discount,
  description: p.description,
  size: (p.size || []).join(", "),
  color: p.color,
  collectionName: p.collectionName,
  isBestseller: p.isBestseller,
  isExclusive: p.isExclusive,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt
   
    }));

    // Define fields (optional: for column order)
    const fields = Object.keys(formattedProducts[0]);
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedProducts);

    fs.writeFileSync("products.csv", csv);
    console.log("✅ CSV file 'products.csv' created successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error exporting CSV:", error);
  }
}

exportToCSV();
