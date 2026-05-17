import React, { useEffect, useRef, useState } from "react";
import "../../Style-CSS/Navbar-css/Navbar.css";
import API from "../api/api";
import CartDrawer from "../Cart/FilledCart";
import { HiOutlineUser } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart, fetchCart } from "../Store/Slices/cartSlice";

import LoginModal from "../B-TO-C-Login/LoginUser";
import SearchMobile from "../Landing/SearchMobileView/SearchMobile";
import WishlistMobileView from "../MobileView/WishlistMobile";
import MobileCategoryView from "../MobileView/NavMobileCategory";
import { getMe, logoutUser } from "../Store/Slices/authSlice";

import MegaMenu from "./Men";

const Navbar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [showMobileWishlist, setShowMobileWishlist] = useState(false);


  const [genders, setGenders] = useState([]);


  const [activeMenu, setActiveMenu] = useState(null);
  // activeMenu = { _id, name } of the hovered gender


  const [activeMobileCategory, setActiveMobileCategory] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = searchParams.get("auth");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);
  const menuTimeoutRef = useRef(null);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    dispatch(getMe());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(mergeCart());
      dispatch(fetchCart());
    }
  }, [user]);

  useEffect(() => {
    API.get("/api/gender")
      .then((res) => setGenders(res.data.genders || []))
      .catch((err) => console.error("Gender fetch error:", err));
  }, []);

  // ─── Profile hover handlers ───────────────────────────────
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowProfile(false), 200);
  };

  // ─── Mega menu hover handlers (with small delay to prevent flicker) ───
  const handleMenuEnter = (gender) => {
    clearTimeout(menuTimeoutRef.current);
    setActiveMenu(gender);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleWishlistClick = () => {
    if (!user) {
      navigate("/?auth=login");
      return;
    }
    const isMobile = window.matchMedia("(max-width: 850px)").matches;
    if (isMobile) setShowMobileWishlist(true);
    else navigate("/wishlist");
  };

  const handleMobileCategoryClick = (gender) => {
    setActiveMobileCategory({ name: gender.name, genderId: gender._id });
    setMobileMenu(false);
  };

  const categoryMeta = {
    Women: { desc: "Shop Westernwear, Indianwear and More", img: "../../images/youngwomen.jpg", bg: "women-bg" },
    Men:   { desc: "Shop Formals, Casuals and Denims",      img: "../../images/men-cloth.jpg",    bg: "men-bg"   },
    Kids:  { desc: "Shop for Boys, Girls and Infants",      img: "../../images/Kids cloth.jpg",   bg: "kids-bg"  },
  };

  // ─── Static extra nav items (non-gender) ─────────────────
  const staticItems = ["Genz", "Wedding"];

  // ─── Profile Dropdown ─────────────────────────────────────
  const ProfileDropdown = () => {
    if (!user) {
      return (
        <div className="profile-dropdown">
          <p className="profile-text">
            Becoming a member comes with easy order tracking, rewards, offers and more.
          </p>
          <button className="login-btn" onClick={() => navigate("?auth=login")}>
            Login/Signup Now →
          </button>
          <div className="dropdown-divider" />
          <div className="dropdown-item">Orders <span>📦</span></div>
        </div>
      );
    }
    return (
      <div className="profile-dropdown">
        <h2>Hi {user.name || "User"}</h2>
        <p>{user.mobile || user.email}</p>
        <div className="dropdown-divider" />
        <div className="dropdown-item">Orders <span>📦</span></div>
        <button className="login-btn" onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  return (
    <>
      <div className="real-navbar-f">
        <div className="real-nav-container">

          {/* LEFT */}
          <div className="nav-left-logo">
            <div className="mobile-menu-icon" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <FaXmark /> : <CiMenuBurger className="bar-icon" />}
            </div>

            <img
              className="logo"
              src="https://aartisto.com/wp-content/uploads/2020/11/myntra.png"
              alt="Logo"
            />


            <ul className="navb-menu">
              {genders.map((gender) => (
                <li
                  key={gender._id}
                  className={`real-nav-item ${activeMenu?._id === gender._id ? "active" : ""}`}
                  onMouseEnter={() => handleMenuEnter(gender)}
                  onMouseLeave={handleMenuLeave}
                >
                  {gender.name}

                  {/* ✅ Single MegaMenu component, passes genderId dynamically */}
                  {activeMenu?._id === gender._id && (
                    <MegaMenu
                      genderName={gender.name}
                      genderId={gender._id}
                      onEnter={() => handleMenuEnter(gender)}
                      onLeave={handleMenuLeave}
                    />
                  )}
                </li>
              ))}

              {/* Static items */}
              {staticItems.map((item) => (
                <li key={item} className="real-nav-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="navb-search-box desktop-search">
            <i className="navb-search-icon">
              <CiSearch className="Laptop-Search-icon" />
            </i>
            <input placeholder="Search for products, brands and more" readOnly />
          </div>

          {/* RIGHT */}
          <div className="navb-nav-right">
            <div
              className="nav-icon profile-wrapper"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <HiOutlineUser className="nav-icon-react hide-user-icon" />
              <p>Profile</p>
              {showProfile && <ProfileDropdown />}
            </div>

            <div className="mobile-search-icon" onClick={() => setOpenSearch(true)}>
              <CiSearch className="Mobile-Search-icon" />
            </div>

            <div className="nav-icon" onClick={handleWishlistClick}>
              <CiHeart className="nav-icon-react" />
              <p>Wishlist</p>
            </div>

            <div className="nav-icon cart-icon-wrapper" onClick={() => setShowCart(true)}>
              <CiShoppingCart className="nav-icon-react" />
              {totalQty > 0 && <span className="nav-cart-badge">{totalQty}</span>}
              <p>Bag</p>
            </div>
          </div>

          {auth === "login" && <LoginModal onClose={() => navigate("/")} />}
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileMenu && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenu(false)} />
        )}

        {/* MOBILE SIDEBAR */}
        <div className={`mobile-sidebar ${mobileMenu ? "open" : ""}`}>
          <div className="mobile-menu-close" onClick={() => setMobileMenu(false)}>
            <FaXmark />
          </div>
          <h2 className="mobile-menu-heading">Categories</h2>
          <div className="mobile-category-list">
            {genders.map((gender, index) => {
              const meta = categoryMeta[gender.name] || {};
              return (
                <div
                  key={gender._id || index}
                  className={`mobile-category-card ${meta.bg || ""}`}
                  style={{
                    backgroundImage: `url(${meta.img || gender.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                  onClick={() => handleMobileCategoryClick(gender)}
                >
                  <div className="card-overlay" />
                  <div className="mobile-category-text">
                    <h3>{gender.name}</h3>
                    <p>{meta.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
        {openSearch && <SearchMobile closeSearch={() => setOpenSearch(false)} />}

        {activeMobileCategory && (
          <MobileCategoryView
            categoryName={activeMobileCategory.name}
            genderId={activeMobileCategory.genderId}
            onBack={() => setActiveMobileCategory(null)}
          />
        )}
      </div>

      {showMobileWishlist && (
        <WishlistMobileView onBack={() => setShowMobileWishlist(false)} />
      )}
    </>
  );
};

export default Navbar;