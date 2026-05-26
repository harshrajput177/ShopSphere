import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, mergeCart } from "./Component/Store/Slices/cartSlice";
import { fetchProductTypes } from "./Component/Store/Slices/ProductType"; 
import ScrollToTop from "./Component/ScrollTop";

import Navbar from "./Component/Navbar/Navbar"; 
import Checkout from "./Component/Order/Checkout";
import MyOrders   from "./Component/Order/MyOrder";
import OrderDetail from "./Component/Order/OrderDetails";
import OrderSuccess from "./Component/Order/OrderSuccess";

const Footer = lazy(() => import("./Component/Footer"));
const Home = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Component/B-TO-C-Login/LoginUser"));
const Wishlist = lazy(() => import("./Component/Wishlist/Wishlist"));
const ViewProduct = lazy(() => import("./Pages/ViewProductPage"));
const ProductListing = lazy(() => import("./Component/ProductListing/ProductListing"));
import SubCategoryProductPage from "./Pages/SubCategoryProductPage";



function App() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(mergeCart()); 
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>

      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ViewProduct />} />

        {/* Old route — rakho taaki purane links toot na jaayein */}
        <Route path="/products/:slug" element={<ProductListing />} />

        {/* ✅ NEW — MegaMenu wale routes: /women/jeans, /men/kurta etc */}
        <Route path="/men/:slug"     element={<ProductListing />} />
        <Route path="/women/:slug"   element={<ProductListing />} />
        <Route path="/kids/:slug"    element={<ProductListing />} />
        <Route path="/wedding/:slug" element={<ProductListing />} />

        {/* Gender-only routes (bina slug ke subCategory click) */}
        <Route path="/men"     element={<ProductListing />} />
        <Route path="/women"   element={<ProductListing />} />
        <Route path="/kids"    element={<ProductListing />} />
        <Route path="/wedding" element={<ProductListing />} />

        <Route path="/occasion/:occasion" element={<ProductListing />} /> 
        <Route path="/search" element={<ProductListing />} />

        <Route path="/checkout"        element={<Checkout />} />
        <Route path="/orders"          element={<MyOrders />} />
        <Route path="/order/:id"       element={<OrderDetail />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/subcategory/:subCategoryId" element={<SubCategoryProductPage />} />
      </Routes>

      <Footer />

    </Suspense>
  );
}

export default App;
