import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchCart, mergeCart } from "./Component/Store/Slices/cartSlice";
import ScrollToTop from "./Component/ScrollTop";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer";
import ViewProduct from "./Pages/ViewProductPage";
import ProductListing from "./Component/ProductListing/ProductListing";


const Home = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Component/B-TO-C-Login/LoginUser"));
const MyOrder = lazy(() => import("./Component/Order/MyOrder"));

const OrderConformation = lazy(() => import("./Component/Order/OrderConformation"));
const OrderTracking = lazy(() => import("./Component/Order/OrderTracking"));

const MobileSearch = lazy(() => import("./Component/Landing/SearchMobileView/SearchMobile"));

const Whislist = lazy(() => import("./Component/Wishlist/Wishlist"));


function App() {

  const [loading, setLoading] = useState(true);
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


  return (

    <Suspense fallback={<div className="page-loader">Loading...</div>}>

      <ScrollToTop />

      <Navbar />


      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />


        <Route path="/MyOrder" element={<MyOrder />} />

        <Route path="/OrderConformation" element={<OrderConformation />} />

        <Route path="/orders/:orderId" element={<OrderTracking />} />

        <Route path="/search" element={<MobileSearch />} />

        <Route path="/Wishlist" element={<Whislist />} />

        <Route path="/product/:id" element={<ViewProduct />} />
        
        <Route path="/products/:slug" element={<ProductListing />} />
     
   

      </Routes>

          {/* 👇 Footer yaha lagao */}
    <Footer />

    </Suspense>

  );

}

export default App;




