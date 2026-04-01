import React, { useState } from "react";
import "../../Style-CSS/MobileView/AccountMobileView.css";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { FaComments, FaQuestionCircle, FaUser } from "react-icons/fa";
import LoginMobileModal from "./LoginUserMobile";

const AccountPannel = () => {

  const [openLogin, setOpenLogin] = useState(false);

  return (

    <> 
    <div className="mobileView-login-container">

      {/* Top Section */}
      <div className="mobileView-login-header">
        <div>
          <h2>Hey, <br /> there!</h2>
          <p 
  className="mobileView-login-link"
 onClick={() => {
  console.log("clicked");
  setOpenLogin(true);
}}
>
  Login Now &gt;
</p>
        </div>
        <FaUserCircle className="mobileView-profile-icon" />
      </div>

      {/* Offer Section */}
      <div className="mobileView-offer-section">
        <p className="mobileView-offer-title">Save big on your first 3 orders</p>

        <div className="mobileView-offer-steps">
          <div className="mobileView-step mobileView-active">
            <span>1st</span>
            <small>Order</small>
            <p>15% Off</p>
          </div>

          <div className="mobileView-step mobileView-locked">
            <span>2nd</span>
            <small>Order</small>
            <p>10% Off</p>
          </div>

          <div className="mobileView-step mobileView-locked">
            <span>3rd</span>
            <small>Order</small>
            <p>10% Off</p>
          </div>
        </div>

        <div className="mobileView-offer-box">
          <p>
            Login Now! Get extra 15% off on your 1st order over ₹700 - <b>NFNEW15</b>
          </p>
          <button onClick={() => setOpenLogin(true)}>
  Login
</button>
        </div>
      </div>

      {/* Orders & Wishlist */}
      <div className="mobileView-account-section">
        <h4>ORDERS AND WISHLIST</h4>

        <div className="mobileView-account-item">
          <div>
            <p className="mobileView-title">Orders</p>
            <span>Login to your account</span>
          </div>
          <FaLock />
        </div>

        <div className="mobileView-account-item">
          <div>
            <p className="mobileView-title">Wishlist</p>
            <span>Login to your account</span>
          </div>
          <FaLock />
        </div>
      </div>


{/* SUPPORT */}
<div className="mobileView-account-section">
  <h4>SUPPORT</h4>

  <div className="mobileView-account-item">
    <div>
      <p className="mobileView-title">Chat with us</p>
      <span>Get help for orders, refund and cancellations</span>
    </div>
    <i className="mobileView-icon"><FaComments /></i>
  </div>

  <div className="mobileView-account-item">
    <div>
      <p className="mobileView-title">Help Center</p>
      <span>Get help from FAQs or raise a concern</span>
    </div>
    <i className="mobileView-icon">❓</i>
  </div>
</div>

{/* PERSONALIZATION */}
<div className="mobileView-account-section">
  <h4>PERSONALIZATION</h4>

  <div className="mobileView-account-item">
    <div>
      <p className="mobileView-title">Profile</p>
      <span>View and update your profile</span>
    </div>
    <i className="mobileView-icon"><FaUser /></i>
  </div>
</div>
    </div>


{/* PREMIUM FOOTER GRID */}
<div className="mobileView-premium-footer">

  <h2 className="mobileView-footer-logo">NYKAA<span>FASHION</span></h2>

  <div className="mobileView-footer-grid">

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">🚚</div>
      <p>Shipping Policy</p>
    </div>

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">📄</div>
      <p>Terms and Conditions</p>
    </div>

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">🔒</div>
      <p>Privacy Policy</p>
    </div>

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">N</div>
      <p>About Us</p>
    </div>

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">📑</div>
      <p>Responsible Disclosure</p>
    </div>

    <div className="mobileView-footer-item">
      <div className="mobileView-circle">📦</div>
      <p>Packaging Policy</p>
    </div>

  </div>
</div>
 {openLogin && (
  <LoginMobileModal onClose={() => setOpenLogin(false)} />
)}
</>
    
  );
};

export default AccountPannel;