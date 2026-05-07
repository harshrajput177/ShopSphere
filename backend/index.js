require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const  BannerRoutes = require("./router/BannerRoute");
const CategoryRouter = require("./router/CategoryRoute");
const SubCategoryRouter = require("./router/SubCategoryRoute");
const ProductRouter = require("./router/Productrouter");
const productTypeRoutes = require("./router/ProductTypeRoute");
const AttributeRoutes = require("./router/AttributeRoute");
const SizeChartRoutes = require("./router/SizechartRoute");
const CollectionRoutes = require("./router/CollectionRoute");
const authRoutes = require("./router/userLoginrouter");
const genderRoutes = require("./router/GenderRoute")
const CartRoutes = require("./router/Cartrouter");
const WishlistRoutes = require("./router/WishlistRoutes")
const compression = require("compression");
const path = require("path");
const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  'https://shopsphere-q4ll.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like curl, Postman)
    if(!origin) return callback(null, true);
 if (allowedOrigins.indexOf(origin) === -1) {
  console.log("❌ Blocked by CORS:", origin);
  return callback(null, false); // ❗ error mat throw kar
}
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(compression()); // for gzip compression

app.use("/uploads", express.static("uploads", {
  maxAge: '7d' // cache images for 7 days
}));


// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


// app.use(guestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gender", genderRoutes);
app.use("/api/banner", BannerRoutes);
app.use("/api/products", ProductRouter); 
app.use("/api/attribute", AttributeRoutes); 
app.use("/api/sizechart", SizeChartRoutes);
app.use("/api/category", CategoryRouter); 
app.use("/api/subcategory", SubCategoryRouter); 
app.use("/api/product-type", productTypeRoutes);
app.use("/api/collection", CollectionRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/wishlist", WishlistRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
