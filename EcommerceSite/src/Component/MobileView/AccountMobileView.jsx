import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMe } from "../Store/Slices/authSlice";
import { logoutUser } from "../Store/Slices/authSlice";
import "../../Style-CSS/MobileView/AccountMobileView.css";
import { FaUserCircle, FaLock, FaComments, FaUser } from "react-icons/fa";
import LoginMobileModal from "./LoginUserMobile";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfileView";
import WishlistView from "../MobileView/WishlistMobile";

const AccountPannel = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe()); // cookie se user fetch
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (openProfile) {
  return <ProfilePage onBack={() => setOpenProfile(false)} />;
}
if (openWishlist) {
  return <WishlistView onBack={() => setOpenWishlist(false)} />;
}
  return (
    <>
      <div className="mobileView-login-container">

        {/* 🔥 HEADER */}
        <div className="mobileView-login-header">
          <div>
            <h2>
              Hey, <br />
              {user ? (user.name || user.phone) : "there!"}
            </h2>

            {!user && (
              <p
                className="mobileView-login-link"
                onClick={() => setOpenLogin(true)}
              >
                Login Now &gt;
              </p>
            )}
          </div>

          <FaUserCircle className="mobileView-profile-icon" />
        </div>

        {/* 🔥 OFFER SECTION */}
        <div className="mobileView-offer-section">
          <p className="mobileView-offer-title">
            Save big on your first 3 orders
          </p>

          <div className="mobileView-offer-steps">
            <div className="mobileView-step mobileView-active">
              <span>1st</span>
              <small>Order</small>
              <p>15% Off</p>
            </div>

            <div className="mobileView-step">
              <span>2nd</span>
              <small>Order</small>
              <p>10% Off</p>
            </div>

            <div className="mobileView-step">
              <span>3rd</span>
              <small>Order</small>
              <p>10% Off</p>
            </div>
          </div>

          <div className="mobileView-offer-box">
            {user ? (
              <p>
                🎉 You’ve unlocked 15% OFF on your first order over ₹700 -{" "}
                <b>NFNEW15</b>
              </p>
            ) : (
              <>
                <p>
                  Login Now! Get extra 15% off on your 1st order over ₹700 -{" "}
                  <b>NFNEW15</b>
                </p>
                <button onClick={() => setOpenLogin(true)}>Login</button>
              </>
            )}
          </div>
        </div>

        {/* 🔥 ORDERS & WISHLIST */}
        <div className="mobileView-account-section">
          <h4>ORDERS AND WISHLIST</h4>

          <div className="mobileView-account-item">
            <div>
              <p className="mobileView-title">Orders</p>
              <span>
                {user ? "Track your orders" : "Login to your account"}
              </span>
            </div>
            {!user && <FaLock />}
          </div>

<div
  className="mobileView-account-item"
  onClick={() => {
    if (user) {
      setOpenWishlist(true); // 🔥 state open
    } else {
      setOpenLogin(true);
    }
  }}
>
  <div>
    <p className="mobileView-title">Wishlist</p>
    <span>
      {user ? "View your saved items" : "Login to your account"}
    </span>
  </div>

  {!user && <FaLock />}
</div>
        </div>

        {/* SUPPORT */}
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

<div
  className="mobileView-account-item"
  onClick={() => {
    if (user) {
      setOpenProfile(true);
    } else {
      setOpenLogin(true);
    }
  }}
>
  <div>
    <p className="mobileView-title">Profile</p>
    <span>
      {user ? "Edit your profile" : "Login required"}
    </span>
  </div>
  <FaUser />
</div>
      </div>
      {user && (
        <div className="mobileView-account-section logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* LOGIN MODAL */}
      {openLogin && (
        <LoginMobileModal onClose={() => setOpenLogin(false)} />
      )}
    </>
  );
};

export default AccountPannel;