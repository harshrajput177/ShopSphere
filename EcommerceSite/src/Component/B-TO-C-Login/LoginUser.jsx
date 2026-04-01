import React from "react";
import "../../Style-CSS/B-TO-C-Login/LoginUser.css"
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

const LoginModal = ({ onClose }) => {
  return (
    <div className="login-overlay" onClick={onClose}>

      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ❌ Close Button */}
        <button className="Login-close-btn" onClick={onClose}>×</button>

        {/* Top Banner */}
        <div className="login-header">
          <h2>NYKAA FASHION</h2>
        </div>

        {/* Content */}
        <div className="login-body">
          <h3>Log in or sign up</h3>
          <p>Get personalised suggestions, offers & more</p>

          {/* Mobile Input */}
          <div className="phone-input">
            <span>+91</span>
            <input type="text" placeholder="XXX-XXX-XXXX" />
          </div>

          <button className="otp-btn">Get OTP</button>

          {/* Divider */}
          <div className="or-divider">OR</div>

          {/* Social Login */}
          <div className="social-login">

            <button className="social-btn google">
              <FcGoogle className="icon" />
              Google
            </button>

            <button className="social-btn apple">
              <FaApple className="icon" />
              Apple
            </button>

            <button className="social-btn facebook">
              <FaFacebookF className="icon" />
              Facebook
            </button>

          </div>

          <p className="terms">
            By continuing, I agree to Terms & Conditions and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;


