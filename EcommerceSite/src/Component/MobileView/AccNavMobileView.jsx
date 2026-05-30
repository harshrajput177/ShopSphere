import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import WishlistView     from "./WishlistMobile";
import CartView         from "../Cart/FilledCart";
import LoginMobileModal from "./LoginUserMobile";

import "../../Style-CSS/MobileView/AccountMobileView.css";



const AccountPage = ({ onClose }) => {
  const dispatch   = useDispatch();
    const navigate = useNavigate();
  const { user }   = useSelector((state) => state.auth);
  const cartItems  = useSelector((state) => state.cart.items);
  const orders     = useSelector((state) => state.order.orders);

  const totalQty    = cartItems.reduce((acc, item) => acc + item.qty, 0);


  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart,     setOpenCart]     = useState(false);
  const [openLogin,    setOpenLogin]    = useState(false);



  const handleWishlistClick = () => {
    if (user) setOpenWishlist(true);
    else      setOpenLogin(true);
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

          <button className="acc-icon-btn" onClick={() => setOpenCart(true)} aria-label="Cart">
            <CiShoppingCart className="acc-icon" />
            {totalQty > 0 && (
              <span className="acc-cart-badge">{totalQty}</span>
            )}
          </button>
        </div>
      </div>

      {openLogin && <LoginMobileModal onClose={() => setOpenLogin(false)} />}
    </>
  );
};

export default AccountPage;