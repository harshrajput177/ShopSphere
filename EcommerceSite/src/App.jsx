import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";

import ScrollToTop from "./Component/ScrollTop";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer";
import ViewProduct from "./Pages/ViewProductPage";
import ProductListing from "./Component/ProductListing/ProductListing";


const Home = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Component/B-TO-C-Login/LoginUser"));
const BestSeller = lazy(() => import("./Component/BestSeller/BestSellerCom1"));
const MyOrder = lazy(() => import("./Component/Order/MyOrder"));

const OrderConformation = lazy(() => import("./Component/Order/OrderConformation"));
const OrderTracking = lazy(() => import("./Component/Order/OrderTracking"));

const MobileSearch = lazy(() => import("./Component/Landing/SearchMobileView/SearchMobile"));

const Whislist = lazy(() => import("./Component/Wishlist/Wishlist"));


function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);

  }, []);



  if (loading) {

    const letters = "ishum".split("");

    return (
      <div className="loader-container">
        <div className="khadija-logo">
          {letters.map((letter, index) => (

            <motion.span
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [0, -30, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="letter"
            >
              {letter}
            </motion.span>

          ))}
        </div>
      </div>
    );
  }



  return (

    <Suspense fallback={<div className="page-loader">Loading...</div>}>

      <ScrollToTop />

      <Navbar />


      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/bestsellers" element={<BestSeller />} />

        <Route path="/MyOrder" element={<MyOrder />} />

        <Route path="/OrderConformation" element={<OrderConformation />} />

        <Route path="/orders/:orderId" element={<OrderTracking />} />

        <Route path="/search" element={<MobileSearch />} />

        <Route path="/Wishlist" element={<Whislist />} />

        <Route path="/View" element={<ViewProduct />} />
        
        <Route path="/Product-View" element={<ProductListing />} />
   

      </Routes>

          {/* 👇 Footer yaha lagao */}
    <Footer />

    </Suspense>

  );

}

export default App;




