import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, mergeCart } from "./Component/Store/Slices/cartSlice";
import ScrollToTop from "./Component/ScrollTop";

import Navbar from "./Component/Navbar/Navbar"; 
const Footer = lazy(() => import("./Component/Footer"));
const Home = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Component/B-TO-C-Login/LoginUser"));
const MobileSearch = lazy(() => import("./Component/Landing/SearchMobileView/SearchMobile"));
const Wishlist = lazy(() => import("./Component/Wishlist/Wishlist"));
const ViewProduct = lazy(() => import("./Pages/ViewProductPage"));
const ProductListing = lazy(() => import("./Component/ProductListing/ProductListing"));


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

        <Route path="/search" element={<MobileSearch />} />

        <Route path="/Wishlist" element={<Wishlist />} />

        <Route path="/product/:id" element={<ViewProduct />} />
        
        <Route path="/products/:slug" element={<ProductListing />} />
     
   

      </Routes>

        
    <Footer />

    </Suspense>

  );

}

export default App;




