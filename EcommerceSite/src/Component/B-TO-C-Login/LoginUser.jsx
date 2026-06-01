import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import OtpModal from "./OtpVerification";
import "../../Style-CSS/B-TO-C-Login/LoginUser.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { mergeCart } from "../Store/Slices/cartSlice";
import { getMe } from "../Store/Slices/authSlice";
import { useToast } from "../Toast/UseToast";
import ToastContainer from "../Toast/ToastContainer";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const handleClose = () => {
    onClose();
    navigate("/", { replace: true });
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOtp = async () => {
    if (!mobile || mobile.length < 10) {
      showToast({ type: "error", title: "Invalid mobile number", message: "Please enter a valid 10-digit number", icon: "lock" });
      return;
    }
    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = `+91${mobile}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setShowOtpModal(true);
      showToast({ type: "success", title: "OTP Sent!", message: `Sent to +91 ${mobile}`, icon: "check" });
    } catch (error) {
      console.log(error);
      showToast({ type: "error", title: "OTP send failed", message: "Please try again after sometime", icon: "lock" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await API.post("/api/auth/google-login", {
        email: user.email,
        name: user.displayName,
        googleId: user.uid,
      }, { withCredentials: true });

      await dispatch(getMe());
      await dispatch(mergeCart());
      showToast({ type: "success", title: "Welcome back!", message: `Logged in as ${user.displayName}`, icon: "check" });
      handleClose();
    } catch (error) {
      console.log(error);
      showToast({ type: "error", title: "Google Login Failed", message: "Please try again", icon: "lock" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {!showOtpModal && (
        <div className="login-overlay" onClick={handleClose}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="Login-close-btn" onClick={handleClose}>×</button>

            <div className="login-header">
              <h2>KELWOR FASHION</h2>
            </div>

            <div className="login-body">
              <h3>Log in or sign up</h3>
              <p>Get personalised suggestions, offers & more</p>

              <div className="phone-input">
                <span>+91</span>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <button className="otp-btn" onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending..." : "Get OTP"}
              </button>

              <div className="or-divider">OR</div>

              <div className="social-login">
                <button className="social-btn google" onClick={handleGoogleLogin}>
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
            handleClose();
          }}
        />
      )}
    </>
  );
};

export default LoginModal;