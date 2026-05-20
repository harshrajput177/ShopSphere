import React, { useState, useRef } from "react";
import API from "../api/api";
import "../B-TO-C-Login/OtpVerification.css";
import { useDispatch } from "react-redux";            // ✅ ADD
import { mergeCart } from "../Store/Slices/cartSlice"; // ✅ ADD
import { getMe } from "../Store/Slices/authSlice";     // ✅ ADD

const OtpModal = ({ mobile, confirmationResult, onClose }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();                      // ✅ ADD

  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return alert("Enter complete OTP");

    try {
      setLoading(true);

      await confirmationResult.confirm(finalOtp);

      await API.post("/api/auth/mobile-login", {
        mobile,
        name: "User",
      }, { withCredentials: true });

      await dispatch(getMe());      // ✅ user Redux mein set karo
      await dispatch(mergeCart());  // ✅ guest cart merge karo

      onClose();
      // ✅ window.location.reload() hataya — ab zaroori nahi
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-overlay" onClick={onClose}>
      <div className="otp-modal" onClick={(e) => e.stopPropagation()}>

        <button className="otp-close-btn" onClick={onClose}>×</button>

        <h2>Enter OTP</h2>
        <p className="otp-sub">Sent to +91 {mobile}</p>

        <div className="otp-box-container">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <p className="resend-text">Resend in 00:30</p>

        <button className="verify-btn" onClick={handleVerifyOtp}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="help-text">
          Having trouble? <span>Get Help</span>
        </p>

      </div>
    </div>
  );
};

export default OtpModal;