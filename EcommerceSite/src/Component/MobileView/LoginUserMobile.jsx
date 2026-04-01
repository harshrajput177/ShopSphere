import React from "react";
import "../../Style-CSS/MobileView/LoginUserMobile.css";
import { FaXmark } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

const LoginMobileModal = ({ onClose }) => {
  return (
    <div className="LoginUserMobile-modal-overlay">
      <div className="LoginUserMobile-modal-container">

        {/* CLOSE BUTTON */}
        <button className="LoginUserMobile-close-btn" onClick={onClose}>
          <FaXmark />
        </button>

        {/* TOP BANNER */}
        <div className="LoginUserMobile-modal-banner">
          <h3>Ready to build your wishlist?</h3>
        </div>

        {/* CONTENT */}
        <div className="LoginUserMobile-modal-content">
          <h2>Log in or sign up</h2>

          <input
            type="text"
            placeholder="Enter mobile no."
            className="LoginUserMobile-input-field"
          />

          <button className="LoginUserMobile-otp-btn">Get OTP</button>

          <div className="LoginUserMobile-social-login">

  <p className="LoginUserMobile-or">OR CONTINUE WITH</p>

  <div className="LoginUserMobile-social-icons">

    <button className="LoginUserMobile-social-btn LoginUserMobile-google">
      <FcGoogle />
    </button>

    <button className="LoginUserMobile-social-btn LoginUserMobile-apple">
      <FaApple />
    </button>

    <button className="LoginUserMobile-social-btn LoginUserMobile-facebook">
      <FaFacebook />
    </button>

  </div>

</div>

          <p className="LoginUserMobile-terms">
            By continuing, I agree to Nykaa's <span>T&C</span> and{" "}
            <span>Privacy Policy</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginMobileModal;