import React, { useEffect, useRef, useState } from "react";
import "../../Style-CSS/Navbar-css/Navbar.css";
import API from "../api/api"
import CartDrawer from "../Cart/FilledCart";
import { HiOutlineUser } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { MdChevronRight } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart, fetchCart } from "../Store/Slices/cartSlice";
import Men from "./Men";
import Women from "./Women";
import Kids from "./Kids";
import LoginModal from "../B-TO-C-Login/LoginUser";
import SearchMobile from "../Landing/SearchMobileView/SearchMobile";
import WishlistView from "../Wishlist/Wishlist";
import WishlistMobileView from "../MobileView/WishlistMobile";
import MobileCategoryView from "../MobileView/NavMobileCategory";

import { getMe, logoutUser } from "../Store/Slices/authSlice";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [showWomen, setShowWomen] = useState(false);
  const [showKids, setShowKids] = useState(false);
  const [showMobileWishlist, setShowMobileWishlist] = useState(false);
  const [genders, setGenders] = useState([]);


  // ← NEW: track which category is open in mobile drill-down
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  // activeMobileCategory = { name: "Men", id: "..._id" }

  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = searchParams.get("auth");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);

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
      .then((res) => {
        const list = res.data.genders || [];
        setGenders(list);
      })
      .catch((err) => console.error("Gender fetch error:", err));
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowProfile(false);
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

// Navbar.js mein — yeh replace karo handleWishlistClick ko
const handleWishlistClick = () => {
  const isMobile = window.matchMedia("(max-width: 850px)").matches;
  if (isMobile) {
    setShowMobileWishlist(true);
  } else {
    navigate("/wishlist");
  }
};

  // ← open mobile category drill-down (gender._id pass karo)
  const handleMobileCategoryClick = (gender) => {
    setActiveMobileCategory({ name: gender.name, genderId: gender._id });
    setMobileMenu(false);
  };

  const categoryMeta = {
    Women: { desc: "Shop Westernwear, Indianwear and More", img: "../../../public/young-woman-holding-shopping-bags.jpg", path: "/women", bg: "women-bg" },
    Men: { desc: "Shop Formals, Casuals and Denims", img: "../../../public/portrait-handsome-confident-stylish-hipster-lambersexual-model-sexy-man-dressed-jeans-jacket-fashion-male-isolated-blue-wall-studio-sunglasses.jpg", path: "/men", bg: "men-bg" },
    Kids: { desc: "Shop for Boys, Girls and Infants", img: "../../../public/girl-posing-with-shopping-bags.jpg", path: "/kids", bg: "kids-bg" },
    GenZ: { desc: "Trending styles for the new generation", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80", path: "/", bg: "genz-bg" },
    Wedding: { desc: "Dress to impress for every occasion", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80", path: "/", bg: "wedding-bg" },
  };

  const ProfileDropdown = () => {
    if (!user) {
      return (
        <div className="profile-dropdown">
          <p className="profile-text">
            Becoming a Nykaa Fashion member comes with easy order tracking, rewards, offers and more.
          </p>
          <button className="login-btn" onClick={() => navigate("?auth=login")}>
            Login/Signup Now →
          </button>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">Orders <span>📦</span></div>
        </div>
      );
    }

    return (
      <div className="profile-dropdown">
        <h2>Hi {user.name || "User"}</h2>
        <p>{user.mobile || user.email}</p>
        <div className="dropdown-divider"></div>
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
            alt=""
          />

          <ul className="navb-menu">
            <li
              className={showMenu ? "real-nav-item active" : "real-nav-item"}
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              Men
              {showMenu && <Men onEnter={() => setShowMenu(true)} onLeave={() => setShowMenu(false)} />}
            </li>

            <li
              className={showWomen ? "real-nav-item active" : "real-nav-item"}
              onMouseEnter={() => setShowWomen(true)}
              onMouseLeave={() => setShowWomen(false)}
            >
              Women
              {showWomen && <Women onEnter={() => setShowWomen(true)} onLeave={() => setShowWomen(false)} />}
            </li>

            <li
              className={showKids ? "real-nav-item active" : "real-nav-item"}
              onMouseEnter={() => setShowKids(true)}
              onMouseLeave={() => setShowKids(false)}
            >
              Kids
              {showKids && <Kids onEnter={() => setShowKids(true)} onLeave={() => setShowKids(false)} />}
            </li>

            <li>Genz</li>
            <li>Wedding</li>
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

          <div className="nav-icon profile-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

      {/* SIDEBAR OVERLAY */}
      {mobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenu(false)} />
      )}

      {/* SIDEBAR */}
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
                onClick={() => handleMobileCategoryClick(gender)} // ← UPDATED
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

      {/* MOBILE SEARCH */}
      {openSearch && <SearchMobile closeSearch={() => setOpenSearch(false)} />}

    


      {/* ← NEW: MOBILE CATEGORY DRILL-DOWN */}
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