import React, { useState } from "react";
import axios from "axios";
import "../../Style-CSS/B-TO-C-Login/LoginUser.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";


import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADzh-2FKnFWIeVvXRrG3MG2gekxR5FtDQ",
  authDomain: "clothecommerce-ff64a.firebaseapp.com",
  projectId: "clothecommerce-ff64a",
  storageBucket: "clothecommerce-ff64a.firebasestorage.app",
  messagingSenderId: "911322921526",
  appId: "1:911322921526:web:bc2b4cb298fe4ec326b697",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const LoginModal = ({ onClose }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );
    }
  };

  const handleSendOtp = async () => {
    try {
      if (!mobile || mobile.length < 10) {
        return alert("Enter valid mobile number");
      }

      setLoading(true);

      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = `+91${mobile}`;

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setConfirmationResult(result);
      setShowOtpBox(true);

      alert("OTP Sent Successfully");
    } catch (error) {
      console.log(error);
      alert("OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  VERIFY OTP + BACKEND LOGIN
  ========================================
  */

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        return alert("Enter OTP");
      }

      setLoading(true);

      await confirmationResult.confirm(otp);

      await axios.post(
        "http://localhost:4000/api/auth/mobile-login",
        {
          mobile,
          name: "User",
        },
        {
          withCredentials: true,
        }
      );

      alert("Login Successful");
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  GOOGLE LOGIN
  ========================================
  */

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      await axios.post(
        "http://localhost:4000/api/auth/google-login",
        {
          email: user.email,
          name: user.displayName,
          googleId: user.uid,
        },
        {
          withCredentials: true,
        }
      );

      alert("Google Login Successful");
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="Login-close-btn"
          onClick={onClose}
        >
          ×
        </button>

        {/* Header */}
        <div className="login-header">
          <h2>NYKAA FASHION</h2>
        </div>

        {/* Body */}
        <div className="login-body">
          <h3>Log in or sign up</h3>
          <p>Get personalised suggestions, offers & more</p>

          {/* Phone Input */}
          <div className="phone-input">
            <span>+91</span>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              maxLength={10}
              onChange={(e) =>
                setMobile(e.target.value)
              }
            />
          </div>

          {/* OTP INPUT */}
          {showOtpBox && (
            <div className="phone-input otp-box">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />
            </div>
          )}

          {/* Button */}
          {!showOtpBox ? (
            <button
              className="otp-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Get OTP"}
            </button>
          ) : (
            <button
              className="otp-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {/* Divider */}
          <div className="or-divider">OR</div>

          {/* Social Login */}
          <div className="social-login">
            <button
              className="social-btn google"
              onClick={handleGoogleLogin}
            >
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
            By continuing, I agree to Terms &
            Conditions and Privacy Policy.
          </p>

          {/* Firebase Recaptcha */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

