import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser } from "../Store/Slices/authSlice";
import { fetchMyOrders } from "../Store/Slices/OrderSlice";
import "../../Style-CSS/MobileView/AccountMobileView.css";
import { FaUserCircle, FaLock, FaComments, FaUser } from "react-icons/fa";
import LoginMobileModal from "./LoginUserMobile";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfileView";
import WishlistView from "../MobileView/WishlistMobile";

const discounts = [
  { order: "1st", off: "15% off", code: "NFNEW15", min: "over ₹700" },
  { order: "2nd", off: "10% off", code: "NFNEW10", min: "over ₹500" },
  { order: "3rd", off: "10% off", code: "NFNEW10B", min: "over ₹500" },
];

const AccountPannel = () => {
  const [openLogin, setOpenLogin]     = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [copied, setCopied]           = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user }   = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);

  // Delivered ya Completed orders count karo, max 3
  const done = Math.min(
    orders.filter((o) =>
      o.status === "Delivered" || o.status === "Completed"
    ).length,
    3
  );

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchMyOrders());
  }, [dispatch, user]);

  const handleLogout = () => dispatch(logoutUser());

  const handleOrdersClick = () => {
    if (!user) setOpenLogin(true);
    else navigate("/orders");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (openProfile) return <ProfilePage onBack={() => setOpenProfile(false)} />;
  if (openWishlist) return <WishlistView onBack={() => setOpenWishlist(false)} />;

  return (
    <>
      <div className="mobileView-login-container">

        {/* ── Header ── */}
        <div className="mobileView-login-header">
          <div>
            <h2>
              Hey, <br />
              {user ? (user.name || user.phone) : "there!"}
            </h2>
            {!user && (
              <p className="mobileView-login-link" onClick={() => setOpenLogin(true)}>
                Login Now &gt;
              </p>
            )}
          </div>
          <FaUserCircle className="mobileView-profile-icon" />
        </div>

        {/* ── Offer Section ── */}
        <div className="mobileView-offer-section">
          <p className="mobileView-offer-title">Save big on your first 3 orders</p>

          {/* Steps */}
          <div className="mobileView-offer-steps">
            {discounts.map((d, i) => {
              const isDone   = i < done;
              const isActive = i === done;
              const isLocked = i > done;
              return (
                <div
                  key={i}
                  className={`mobileView-step ${
                    isDone   ? "mobileView-step--done"   :
                    isActive ? "mobileView-step--active" :
                               "mobileView-step--locked"
                  }`}
                >
                  {isDone   && <span className="mobileView-step-tick">✓</span>}
                  {isLocked && <span className="mobileView-step-tick">🔒</span>}
                  <span className="mobileView-step-label">{d.order}</span>
                  <span className="mobileView-step-off">{d.off}</span>
                </div>
              );
            })}
          </div>

          {/* Offer Box */}
          {!user ? (
            // Not logged in
            <div className="mobileView-offer-box">
              <p>
                Login Now! Get extra <b>15% off</b> on your 1st order over ₹700 —{" "}
                <b>NFNEW15</b>
              </p>
              <button onClick={() => setOpenLogin(true)}>Login</button>
            </div>

          ) : done >= 3 ? (
            // Sab 3 orders complete — all unlocked
            <div className="mobileView-offer-box mobileView-offer-box--success">
              <p className="mobileView-all-unlock-title">🎉 All discounts unlocked!</p>
              {discounts.map((d) => (
                <div className="mobileView-unlock-row" key={d.code}>
                  <span>
                    {d.order} order — <b>{d.off}</b>{" "}
                    <span className="mobileView-code">{d.code}</span>
                  </span>
                  <button
                    className="mobileView-copy-small"
                    onClick={() => copyCode(d.code)}
                  >
                    {copied === d.code ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>

          ) : (
            // Current unlock — next order ka discount
            <div className="mobileView-offer-box">
              <p>
                {done === 0
                  ? "🎉 You've unlocked"
                  : `✅ ${done} order${done > 1 ? "s" : ""} done! Unlock`}{" "}
                <b>{discounts[done].off}</b> on your {discounts[done].order} order{" "}
                {discounts[done].min} — <b>{discounts[done].code}</b>
              </p>
              <button
                className="mobileView-copy-small"
                onClick={() => copyCode(discounts[done].code)}
              >
                {copied === discounts[done].code ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* ── Orders & Wishlist ── */}
        <div className="mobileView-account-section">
          <h4>ORDERS AND WISHLIST</h4>

          <div className="mobileView-account-item" onClick={handleOrdersClick}>
            <div>
              <p className="mobileView-title">Orders</p>
              <span>{user ? "Track your orders" : "Login to your account"}</span>
            </div>
            {!user && <FaLock />}
          </div>

          <div
            className="mobileView-account-item"
            onClick={() => user ? setOpenWishlist(true) : setOpenLogin(true)}
          >
            <div>
              <p className="mobileView-title">Wishlist</p>
              <span>{user ? "View your saved items" : "Login to your account"}</span>
            </div>
            {!user && <FaLock />}
          </div>
        </div>

        {/* ── Support ── */}
        <div className="mobileView-account-section">
          <h4>SUPPORT</h4>

          <div className="mobileView-account-item">
            <div>
              <p className="mobileView-title">Chat with us</p>
              <span>Help for orders & refunds</span>
            </div>
            <FaComments />
          </div>

          <div className="mobileView-account-item">
            <div>
              <p className="mobileView-title">Help Center</p>
              <span>FAQs & support</span>
            </div>
            ❓
          </div>
        </div>

        {/* ── Profile ── */}
        <div
          className="mobileView-account-item"
          onClick={() => user ? setOpenProfile(true) : setOpenLogin(true)}
        >
          <div>
            <p className="mobileView-title">Profile</p>
            <span>{user ? "Edit your profile" : "Login required"}</span>
          </div>
          <FaUser />
        </div>

      </div>

      {/* ── Logout ── */}
      {user && (
        <div className="mobileView-account-section logout-section">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* ── Login Modal ── */}
      {openLogin && <LoginMobileModal onClose={() => setOpenLogin(false)} />}
    </>
  );
};

export default AccountPannel;