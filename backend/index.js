require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const CategoryRouter = require("./router/CategoryRoute");
const SubCategoryRouter = require("./router/SubCategoryRoute");
const ProductRouter = require("./router/Productrouter");
const productTypeRoutes = require("./router/ProductTypeRoute");
const SubproductTypeRoutes = require("./router/SubProductTypeRoute");
const CollectionRoutes = require("./router/CollectionRoute");
const compression = require("compression");
const path = require("path");
const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
  'https://www.ishum.in',
  'https://ishum.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ishum-frontend.onrender.com',
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like curl, Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy: This origin is not allowed.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(compression()); // for gzip compression

app.use("/uploads", express.static("uploads", {
  maxAge: '7d' // cache images for 7 days
}));


// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


app.use("/api/products", ProductRouter); 
app.use("/api/category", CategoryRouter); 
app.use("/api/subcategory", SubCategoryRouter); 
app.use("/api/product-type", productTypeRoutes);
app.use("/api/sub-product-type", SubproductTypeRoutes);
app.use("/api/collection", CollectionRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
