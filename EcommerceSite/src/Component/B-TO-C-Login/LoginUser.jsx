import React, { useState } from "react";
import API from "../api/api"; 
import OtpModal from "./OtpVerification";
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const LoginModal = ({ onClose }) => {
  const [mobile, setMobile] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => { },
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

      setShowOtpModal(true);

    } catch (error) {
      console.log(error);
      alert("OTP send failed");
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

  await API.post(
  "/api/auth/google-login",
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
    <>
      {!showOtpModal && (
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



            <button
              className="otp-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Get OTP"}
            </button>


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
    )}
    
   {showOtpModal && (
      <OtpModal
        mobile={mobile}
        confirmationResult={confirmationResult}
        onClose={() => {
          setShowOtpModal(false);
          onClose(); // 🔥 close everything after OTP
        }}
      />
    )}
    </>
  );
};

export default LoginModal;

