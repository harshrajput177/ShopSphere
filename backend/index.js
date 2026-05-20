require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const https = require("https");
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
const RatingRoutes =require("./router/ReviewRoutes")
const OrderRoute = require("./router/OrderRoutes")
const AddressRoute = require("./router/Addressrouter")
const PaymentRoute = require("./router/PaymentRoute")
const compression = require("compression");
const path = require("path");
const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");

app.use(cors({
  origin: [
    "http://localhost:5173",
     "http://localhost:5174",
    "https://shopsphere-frontend-9zee.onrender.com"
  ],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(compression()); // for gzip compression


// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

    const keepAlive = () => {
  https.get("https://shopsphere-q4ll.onrender.com/api/health", (res) => {
    console.log("Keep alive ping:", res.statusCode);
  }).on("error", (err) => {
    console.log("Ping error:", err.message);
  });
};

setInterval(keepAlive, 2 * 60 * 1000);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
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
app.use("/api/ratings", RatingRoutes);
app.use("/api/address", AddressRoute);
app.use("/api/payment", PaymentRoute);
app.use("/api/orders",    OrderRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
