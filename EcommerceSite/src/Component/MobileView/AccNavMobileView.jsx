import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";  

import WishlistView     from "./WishlistMobile";
import CartView         from "../Cart/FilledCart";
import LoginMobileModal from "../B-TO-C-Login/LoginUser";

import "../../Style-CSS/MobileView/AccountMobileView.css";

const AccountPage = ({ onClose }) => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams(); 

  const { user }   = useSelector((state) => state.auth);
  const cartItems  = useSelector((state) => state.cart.items);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart,     setOpenCart]     = useState(false);
  const [openLogin,    setOpenLogin]    = useState(false);  // ✅ missing tha, add kiya


  useEffect(() => {
    if (searchParams.get("auth") === "login") {
      setOpenLogin(true);
    }
  }, [searchParams]);

  // ✅ Modal band hone par URL clean karo
  const handleCloseLogin = () => {
    setOpenLogin(false);
    navigate("/", { replace: true });
  };

  const handleWishlistClick = () => {
    if (user) setOpenWishlist(true);
    else      navigate("/?auth=login");  // ✅ route pe bhejo
  };

  const handleCartClick = () => {
    if (user) setOpenCart(true);
    else      navigate("/?auth=login");  // ✅ cart bhi protect karo (optional)
  };

  if (openWishlist) return <WishlistView onBack={() => setOpenWishlist(false)} />;
  if (openCart)     return <CartView     onClose={() => setOpenCart(false)}    />;

  return (
    <>
      {/* ── HEADER ── */}
      <div className="acc-header">
        <button
          className="acc-back-btn"
          aria-label="Go back"
          onClick={onClose}
        >
          <FaArrowLeftLong />
        </button>

        <div className="acc-logo">
          <span className="acc-logo-main">Kelwor</span>
          <span className="acc-logo-sub">Fashion</span>
        </div>

        <div className="acc-header-right">
          <button className="acc-icon-btn" onClick={handleWishlistClick} aria-label="Wishlist">
            <CiHeart className="acc-icon" />
          </button>

          <button className="acc-icon-btn" onClick={handleCartClick} aria-label="Cart">
            <CiShoppingCart className="acc-icon" />
            {totalQty > 0 && (
              <span className="acc-cart-badge">{totalQty}</span>
            )}
          </button>
        </div>
      </div>

      {openLogin && <LoginMobileModal onClose={handleCloseLogin} />}
    </>
  );
};

export default AccountPage;