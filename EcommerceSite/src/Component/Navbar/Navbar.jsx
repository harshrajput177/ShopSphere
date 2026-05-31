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
import img from "../../images/928afd9a-95ac-464d-8f91-1ca3dd2deeb5.png";

import MegaMenu from "./Men";

const Navbar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [showMobileWishlist, setShowMobileWishlist] = useState(false);
  const [genders, setGenders] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
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

  // ─── Search States ────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    () => JSON.parse(localStorage.getItem("recentSearches") || "[]")
  );
  const [showSugg, setShowSugg] = useState(false);
  const searchRef = useRef(null);

  // Trending — sirf ek baar fetch
  useEffect(() => {
    API.get("/api/products/search/trending")
      .then((res) => setTrending(res.data.trending || []))
      .catch(() => {});
  }, []);

  // Debounced suggestions fetch
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await API.get(
          `/api/products/search/suggest?q=${encodeURIComponent(searchQuery)}`
        );
        setSuggestions(res.data.suggestions || []);
        setShowSugg(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recent search save karo
  const saveRecent = (query) => {
    const updated = [
      query,
      ...recentSearches.filter((r) => r !== query),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const deleteRecent = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = recentSearches.filter((r) => r !== item);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (q = searchQuery) => {
    const query = typeof q === "object" ? q.text || "" : String(q);
    if (!query.trim()) return;
    saveRecent(query.trim());
    setShowSugg(false);
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Outside click se suggestions band
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSugg(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Other Effects ────────────────────────────────────────
  useEffect(() => {
    dispatch(getMe());
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

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowProfile(false), 200);
  };

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
    Women: { desc: "Shop Westernwear, Indianwear and More", bg: "women-bg" },
    Men:   { desc: "Shop Formals, Casuals and Denims",      bg: "men-bg"   },
    Kids:  { desc: "Shop for Boys, Girls and Infants",      bg: "kids-bg"  },
  };

  const staticItems = ["Wedding"];

  // Suggestions ko type ke hisaab se alag karo
  const keywordSuggestions  = suggestions.filter((s) => s.type === "keyword");
  const categorySuggestions = suggestions.filter((s) => s.type === "category");
  const productSuggestions  = suggestions.filter((s) => s.type === "product");

  // Dropdown dikhao ya nahi
  const showEmptyState =
    showSugg && searchQuery.length < 2 &&
    (recentSearches.length > 0 || trending.length > 0);
  const showResults =
    showSugg && searchQuery.length >= 2 && suggestions.length > 0;
  const showDropdown = showEmptyState || showResults;

  // ─── Profile Dropdown ─────────────────────────────────────
  const ProfileDropdown = () => {
    if (!user) {
      return (
        <div className="profile-dropdown">
          <p className="profile-text">
            Becoming a member comes with easy order tracking, rewards, offers
            and more.
          </p>
          <button className="login-btn" onClick={() => navigate("?auth=login")}>
            Login/Signup Now →
          </button>
          <div className="dropdown-divider" />
          <div className="dropdown-item">
            Orders <span>📦</span>
          </div>
        </div>
      );
    }
    return (
      <div className="profile-dropdown">
        <h2>Hi {user.name || "User"}</h2>
        <p>{user.mobile || user.email}</p>
        <div className="dropdown-divider" />
        <div className="dropdown-item">
          Orders <span>📦</span>
        </div>
        <button className="login-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="real-navbar-f">
        <div className="real-nav-container">

          {/* LEFT */}
          <div className="nav-left-logo">
            <div
              className="mobile-menu-icon"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <FaXmark />
              ) : (
                <CiMenuBurger className="bar-icon" />
              )}
            </div>

            <img className="nav-logo" src={img} alt="Logo" />

            <ul className="navb-menu">
              {genders.map((gender) => (
                <li
                  key={gender._id}
                  className={`real-nav-item ${
                    activeMenu?._id === gender._id ? "active" : ""
                  }`}
                  onMouseEnter={() => handleMenuEnter(gender)}
                  onMouseLeave={handleMenuLeave}
                >
                  {gender.name}
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
              {staticItems.map((item) => (
                <li key={item} className="real-nav-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="navb-search-box desktop-search" ref={searchRef}>
            <i className="navb-search-icon" onClick={() => handleSearch()}>
              <CiSearch className="Laptop-Search-icon" />
            </i>
            <input
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSugg(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setShowSugg(true)}
            />
            {searchQuery && (
              <span
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                }}
              >
                <FaXmark />
              </span>
            )}

            {/* ── Suggestions Dropdown ── */}
            {showDropdown && (
              <div className="search-suggestions">

                {/* Empty state: Recent + Trending */}
                {showEmptyState && (
                  <>
                    {recentSearches.length > 0 && (
                      <>
                        <div className="sugg-section-label">Recent searches</div>
                        {recentSearches.map((item, i) => (
                          <div
                            key={i}
                            className="suggestion-item recent"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSearch(item);
                            }}
                          >
                            <CiSearch className="sugg-icon" />
                            <span>{item}</span>
                            <span
                              className="sugg-delete"
                              onMouseDown={(e) => deleteRecent(e, item)}
                            >
                              <FaXmark />
                            </span>
                          </div>
                        ))}
                        {trending.length > 0 && (
                          <div className="sugg-divider" />
                        )}
                      </>
                    )}

                    {trending.length > 0 && (
                      <>
                        <div className="sugg-section-label">Trending</div>
                        {trending.map((t, i) => (
                          <div
                            key={i}
                            className="suggestion-item trending"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSearch(t.text);
                            }}
                          >
                            <span className="sugg-trend-icon">🔥</span>
                            <span>{t.text}</span>
                            <span className="sugg-badge">Trending</span>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {/* Query typed: Keyword + Category + Product suggestions */}
                {showResults && (
                  <>
                    {/* Keywords */}
                    {keywordSuggestions.length > 0 && (
                      <>
                        <div className="sugg-section-label">Suggestions</div>
                        {keywordSuggestions.map((s, i) => (
                          <div
                            key={i}
                            className="suggestion-item"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSearch(s.text);
                            }}
                          >
                            <CiSearch className="sugg-icon" />
                            <span>{s.text}</span>
                            {s.meta && (
                              <span className="sugg-badge sugg-badge-gray">
                                {s.meta}
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Categories */}
                    {categorySuggestions.length > 0 && (
                      <>
                        {keywordSuggestions.length > 0 && (
                          <div className="sugg-divider" />
                        )}
                        <div className="sugg-section-label">Categories</div>
                        {categorySuggestions.map((s, i) => (
                          <div
                            key={i}
                            className="suggestion-item category"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSearch(s.text);
                            }}
                          >
                            <span className="sugg-cat-icon">📂</span>
                            <span>{s.text}</span>
                            {s.meta && (
                              <span className="sugg-badge sugg-badge-gray">
                                {s.meta}
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Products */}
                    {productSuggestions.length > 0 && (
                      <>
                        {(keywordSuggestions.length > 0 ||
                          categorySuggestions.length > 0) && (
                          <div className="sugg-divider" />
                        )}
                        <div className="sugg-section-label">Products</div>
                        {productSuggestions.map((s, i) => (
                          <div
                            key={i}
                            className="suggestion-item product"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setShowSugg(false);
                              navigate(`/product/${s.id}`);
                            }}
                          >
                            <div className="sugg-product-img">
                              {s.image ? (
                                <img src={s.image} alt={s.text} />
                              ) : (
                                <span>👕</span>
                              )}
                            </div>
                            <div className="sugg-product-info">
                              <span className="sugg-product-name">
                                {s.text}
                              </span>
                              <span className="sugg-product-meta">
                                {s.meta}
                              </span>
                            </div>
                            {s.price && (
                              <span className="sugg-product-price">
                                {s.price}
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
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

            <div
              className="mobile-search-icon"
              onClick={() => setOpenSearch(true)}
            >
              <CiSearch className="Mobile-Search-icon" />
            </div>

            <div className="nav-icon" onClick={handleWishlistClick}>
              <CiHeart className="nav-icon-react" />
              <p>Wishlist</p>
            </div>

            <div
              className="nav-icon cart-icon-wrapper"
              onClick={() => setShowCart(true)}
            >
              <CiShoppingCart className="nav-icon-react" />
              {totalQty > 0 && (
                <span className="nav-cart-badge">{totalQty}</span>
              )}
              <p>Bag</p>
            </div>
          </div>

          {auth === "login" && <LoginModal onClose={() => navigate("/")} />}
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileMenu && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* MOBILE SIDEBAR */}
        <div className={`mobile-sidebar ${mobileMenu ? "open" : ""}`}>
          <div
            className="mobile-menu-close"
            onClick={() => setMobileMenu(false)}
          >
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
        {openSearch && (
          <SearchMobile closeSearch={() => setOpenSearch(false)} />
        )}

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