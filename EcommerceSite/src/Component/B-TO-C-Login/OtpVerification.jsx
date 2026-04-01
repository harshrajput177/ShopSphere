import React, { useState, useEffect } from "react";
import { useAuth } from "../../ContextApiCart/LoginContextApi"; 
import "./OtpVerification.css";
import GoogleIcon from '@mui/icons-material/Google';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OtpVerification = ({ phone, name, email, mode, onBack, setShowB2UModal, setShowLoginModal }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const { setIsLoggedIn, setUser, setToken } = useAuth();

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const normalizePhone = (phone) => {
    return phone.startsWith("+91") ? phone : `+91${phone}`;
  };

const handleVerify = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length < 4) {
    toast.error("Please enter 4-digit OTP");
    return;
  }

  const payload = {
    phone: normalizePhone(phone),
    otp: enteredOtp,
    mode,
  };

  if (mode === "register") {
    if (!name || !email) {
      toast.error("Name and Email are required for registration");
      return;
    }
    payload.name = name;
    payload.email = email;
  }

  try {
    const response = await fetch(`${baseURL}/api/user/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

   if (data.success) {
  toast.success("OTP Verified ✅");


    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

  setToken(data.token);
     setToken(data.token); 
        setUser(data.user);
        setIsLoggedIn(true);
  // Optional: backend should send minimal user info with response,
  // if not, you can create a user object with userId and phone:
  const user = data.user || { _id: data.userId, phone: normalizePhone(phone) };
  setUser(user);

  setIsLoggedIn(true);
  setShowB2UModal(false);
  setShowLoginModal(false);

  if (data.isNewUser) {
    // Show a welcome message or redirect to profile setup
    toast.info("Welcome new user! Please complete your profile.");
    // Example: redirect or open profile setup modal
    // navigate('/profile-setup');
  } else {
    
     navigate('/');
  }
}
else {
      toast.error(data.message || "Verification failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Verification failed");
  }
};


  return (
    <div className="otp-verification-container">
      <ToastContainer position="top-center" autoClose={2000} />
      
      <h2 className="otp-title">Verification code</h2>
      <p className="otp-subtitle">
        Please enter the verification code we sent to your mobile number.
      </p>

      <div className="otp-inputs">
        {otp.map((value, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            maxLength={1}
            className="otp-input"
            value={value}
            onChange={(e) => handleChange(e, i)}
          />
        ))}
      </div>

      <p className="otp-resend">Resend in 00:{timer < 10 ? `0${timer}` : timer}</p>

      <div className="verify-btn-login-acount">
        <button className="otp-submit-btn" onClick={handleVerify}>
          VERIFY OTP
        </button>

        <p className="otp-alt-signup">or sign up with</p>
        <div className="otp-socials">
          <button><img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" /></button>
          <button><GoogleIcon /></button>
          <button><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" /></button>
        </div>

        <p className="otp-login-text">
          Already have account? <span onClick={onBack} className="otp-login-link">Log In</span>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;

