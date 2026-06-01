import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser } from "../Store/Slices/authSlice";
import { fetchMyOrders } from "../Store/Slices/OrderSlice";
import "../../Style-CSS/MobileView/AccountMobileView.css";
import { FaUserCircle, FaLock, FaComments, FaUser } from "react-icons/fa";
import LoginMobileModal from "../B-TO-C-Login/LoginUser";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfileView";
import WishlistView from "../MobileView/WishlistMobile";

const discounts = [
  { order: "1st", off: "15% off", code: "NFNEW15", min: "over ₹700" },
  { order: "2nd", off: "10% off", code: "NFNEW10", min: "over ₹500" },
  { order: "3rd", off: "10% off", code: "NFNEW10B", min: "over ₹500" },
];

const AccountPannel = () => {
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
    o.status === "Delivered" ||
    o.status === "Completed" ||
    o.status === "Confirmed" ||
    o.status === "Shipped"
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
  if (!user) navigate("/?auth=login");
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
   <p className="mobileView-login-link" onClick={() => navigate("/?auth=login")}>
                Login Now &gt;
              </p>
            )}
          </div>
          <FaUserCircle className="mobileView-profile-icon" />
        </div>

        {/* ── Offer Section ── */}
        <div className="mobileView-offer-section">
          <p className="mobileView-offer-title">Save big on your first 3 orders</p>

      <div className="mobileView-offer-steps">
  {discounts.map((d, i) => {
    const isDone   = i < done;
    const isActive = i === done;
    const isLocked = i > done;
    const stateClass = isDone ? "mobileView-step--done" : isActive ? "mobileView-step--active" : "mobileView-step--locked";
    const [num, ...rest] = d.order.split("");

    return (
      <div key={i} className={`mobileView-step-wrapper ${stateClass}`}>
        <div className="mobileView-step-lock">
          {isDone ? "✓" : isLocked ? "🔒" : ""}
        </div>
        <div className="mobileView-step-circle">
          <span className="mobileView-step-circle-num">
            {num}<sup>{rest.join("")}</sup>
          </span>
          <span className="mobileView-step-circle-label">Order</span>
        </div>
        <span className="mobileView-step-badge">{d.off}</span>
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
              <button onClick={() => navigate("/?auth=login")}>Login</button>
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
          onClick={() => user ? setOpenWishlist(true) : navigate("/?auth=login")}
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
       onClick={() => user ? setOpenProfile(true) : navigate("/?auth=login")}
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

    </>
  );
};

export default AccountPannel;