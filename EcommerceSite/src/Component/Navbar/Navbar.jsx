import React, { useRef, useState } from "react";
import "../../Style-CSS/Navbar-css/Navbar.css";
import CartDrawer from "../Cart/FilledCart";
import { HiOutlineUser } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
import Men from "./Men";
import LoginModal from "../B-TO-C-Login/LoginUser";
import SearchMobile from "../Landing/SearchMobileView/SearchMobile";

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false); // ✅ NEW
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = searchParams.get("auth");

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowProfile(false);
    }, 200);
  };

  const ProfileDropdown = () => {
    return (
      <div className="profile-dropdown">
        <p className="profile-text">
          Becoming a Nykaa Fashion member comes with easy order tracking,
          rewards, offers and more.
        </p>

        <button
          className="login-btn"
          onClick={() => navigate("?auth=login")}
        >
          Login/Signup Now →
        </button>

        <div className="dropdown-divider"></div>

        <div className="dropdown-item">
          Orders <span>📦</span>
        </div>
      </div>
    );
  };

  return (
    <div className="real-navbar-f">

      <div className="real-nav-container">

        {/* LEFT */}
        <div className="nav-left-logo">

          {/* 🔥 MOBILE MENU ICON */}
          <div
            className="mobile-menu-icon"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaXmark /> : <CiMenuBurger className="bar-icon"/>}
          </div>

          <img
            className="logo"
            src="https://aartisto.com/wp-content/uploads/2020/11/myntra.png"
            alt=""
          />

          {/* MENU */}
          <ul className={`navb-menu ${mobileMenu ? "open" : ""}`}>

            <li
              className={showMenu ? "real-nav-item active" : "real-nav-item"}
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              Men

              {/* Desktop Dropdown */}
              {showMenu && !mobileMenu && (
                <Men
                  onEnter={() => setShowMenu(true)}
                  onLeave={() => setShowMenu(false)}
                />
              )}
            </li>

            <li>Women</li>
            <li>Kids</li>
            <li>Genz</li>
            <li>Wedding</li>

          </ul>
        </div>

 
 {/* 🔍 DESKTOP SEARCH */}
<div 
  className="navb-search-box desktop-search"
>
  <i className="navb-search-icon">
    <CiSearch  className="Laptop-Search-icon"/>
  </i>
  <input 
    placeholder="Search for products, brands and more"
    readOnly
  />
</div>

{/* 🔍 MOBILE SEARCH ICON */}


        {/* RIGHT */}
        <div className="navb-nav-right">

          {/* PROFILE */}
          <div
            className="nav-icon profile-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <HiOutlineUser className="nav-icon-react hide-user-icon" />
            <p>Profile</p>

            {showProfile && <ProfileDropdown />}
          </div>

          <div 
  className="mobile-search-icon"
  onClick={() => setOpenSearch(true)}
>
  <CiSearch  className="Mobile-Search-icon"/>
  
</div>

          {/* WISHLIST */}
          <div className="nav-icon">
            <CiHeart className="nav-icon-react" />
            <p>Wishlist</p>
          </div>

          {/* CART */}
          <div
            className="nav-icon"
            onClick={() => setShowCart(true)}
          >
            <CiShoppingCart className="nav-icon-react" />
            <p>Bag</p>
          </div>

        </div>

        {/* LOGIN MODAL */}
        {auth === "login" && (
          <LoginModal onClose={() => navigate("/")} />
        )}

      </div>

      {/* CART DRAWER */}
      {showCart && (
        <CartDrawer onClose={() => setShowCart(false)} />
      )}
      {openSearch && (
  <SearchMobile closeSearch={() => setOpenSearch(false)} />
)}

    </div>
  );
};

export default Navbar;