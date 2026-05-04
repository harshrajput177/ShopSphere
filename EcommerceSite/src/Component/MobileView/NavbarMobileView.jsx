import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CiHeart, CiShoppingCart } from "react-icons/ci";

import WishlistView from "./WishlistMobile";
import CartView from "../Cart/FilledCart";
import LoginMobileModal from "./LoginUserMobile";

import "../../Style-CSS/Navbarbottom.css";

const AccountPage = () => {

  const { user } = useSelector((state) => state.auth);

  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  // 🔥 HANDLE CLICKS
  const handleWishlistClick = () => {
    if (user) {
      setOpenWishlist(true);
    } else {
      setOpenLogin(true);
    }
  };

  const handleCartClick = () => {
      setOpenCart(true);
  };

  // 🔥 CONDITIONAL PAGES
  if (openWishlist) {
    return <WishlistView onBack={() => setOpenWishlist(false)} />;
  }

  if (openCart) {
    return <CartView onBack={() => setOpenCart(false)} />;
  }

  return (
    <>
      {/* 🔥 HEADER SAME PAGE */}
      <div className="account-header-bar">

        {/* BACK */}
        <FaArrowLeftLong className="header-icon" />

        {/* LOGO */}
        <h2 className="header-logo">
          NYKAA <span>FASHION</span>
        </h2>

        {/* ICONS */}
        <div className="header-right">
          <CiHeart
            className="header-icon"
            onClick={handleWishlistClick}
          />

          <CiShoppingCart
            className="header-icon"
            onClick={handleCartClick}
          />
        </div>
      </div>


      {/* 🔥 LOGIN MODAL */}
      {openLogin && (
        <LoginMobileModal onClose={() => setOpenLogin(false)} />
      )}
    </>
  );
};

export default AccountPage;