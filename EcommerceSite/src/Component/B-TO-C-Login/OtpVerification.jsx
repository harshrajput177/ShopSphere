import React, { useState, useRef } from "react";
import axios from "axios";
import "../B-TO-C-Login/OtpVerification.css";

const OtpModal = ({ mobile, confirmationResult, onClose }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto next focus
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

    if (finalOtp.length !== 6) {
      return alert("Enter complete OTP");
    }

    try {
      setLoading(true);

      await confirmationResult.confirm(finalOtp);

      await axios.post(
        "http://localhost:4000/api/auth/mobile-login",
        {
          mobile,
          name: "User",
        },
        { withCredentials: true }
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

  return (
    <div className="otp-overlay" onClick={onClose}>
      <div className="otp-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="otp-close-btn" onClick={onClose}>×</button>

        <h2>Enter OTP</h2>
        <p className="otp-sub">
          Sent to +91 {mobile}
        </p>

        {/* 🔥 OTP BOXES */}
        <div className="otp-box-container">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* TIMER */}
        <p className="resend-text">
          Resend in 00:30
        </p>

        {/* BUTTON */}
        <button
          className="verify-btn"
          onClick={handleVerifyOtp}
        >
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