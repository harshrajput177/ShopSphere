// BottomNavbar.jsx
import React, { useState } from "react";
import { useEffect } from "react";
import '../Style-CSS/Navbarbottom.css';
import { IoHomeOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { AiOutlineFire } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { Link } from "react-router-dom";
import AccountPage from "./MobileView/AccountMobileView"
import AccountHeader from "./MobileView/NavbarMobileView";
import CartDrawer from "./Cart/FilledCart";
import Category from "./MobileView/CategoryMobileView";

const BottomNavbar = () => {

  const [openAccount, setOpenAccount] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);


useEffect(() => {
  if (openAccount || openCart || openCategory) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [openAccount, openCart, openCategory]);



  return (
     <>
    <div className="bottom-navbar">
      <Link to="/" className="navbot-item">
        <IoHomeOutline className="navbot-icon" />
        <span>Home</span>
      </Link>

  <div 
  className="navbot-item"
  onClick={() => setOpenCategory(true)}
>
  <BiCategory className="navbot-icon" />
  <span>Category</span>
</div>

        <Link to="/bestsellers" className="navbot-item">
        <AiOutlineFire className="navbot-icon" />
        <span>Bestseller</span>
      </Link>

      <div 
  className="navbot-item"
  onClick={() => setOpenCart(true)}
>
  <IoCartOutline className="navbot-icon" />
  <span>Cart</span>
</div>

    <div 
  className="navbot-item"
  onClick={() => setOpenAccount(true)}
>
  <HiOutlineUser className="navbot-icon" />
  <span>Account</span>
</div>


    </div>

   {openAccount && (
  <div className="account-fullscreen">

    {/* ✅ HEADER ADD HERE */}
    <AccountHeader onClose={() => setOpenAccount(false)} />

    {/* ✅ PAGE CONTENT */}
    <AccountPage />

  </div>
)}

{openCart && (
  <CartDrawer onClose={() => setOpenCart(false)} />
)}

{openCategory && (
  <Category onClose={() => setOpenCategory(false)} />
)}
     </>
  );
};

export default BottomNavbar;
