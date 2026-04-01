import React, { useState } from "react";
import axios from "axios";
import "../B-TO-C-Login/RegisterUser.css";
import img1 from '../../images/18839a14eab62a1c7d6277c6f8ba14f8.png';
import OtpVerification from "./OtpVerification";
import GoogleIcon from '@mui/icons-material/Google';
import { ToastContainer, toast } from "react-toastify";
import { useGoogleLogin } from "./FireBaseAuth/Handlefetch";
import { useAuth } from "../../ContextApiCart/LoginContextApi"; 
import "react-toastify/dist/ReactToastify.css";

const SignupForm = ({ setShowB2UModal, setShowLoginModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [phone, setPhone] = useState(""); // For OTPVerification
  const { handleGoogleLogin } = useGoogleLogin();

  // Get auth context setters
  const { setUser, setToken, setIsLoggedIn } = useAuth();

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/user/register`, {
        name,
        email,
        phone,
      });

      setMessage(response.data.message);

      if (response.data.success) {
        // Save phone for OTP step
        setPhone(phone);
        setShowOtpStep(true);

        // If your register API returns token and user immediately, you can do this here:
        // (Else, you can do it inside your OTP verification success handler)
        
        if (response.data.token && response.data.user) {
          setToken(response.data.token);
          setUser(response.data.user);
          setIsLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="RegisterUser-container">
      <div className="RegisterUser-form-section">
        {!showOtpStep ? (
          <>
            <h1 className="RegisterUser-title">Create</h1>
            <h2 className="RegisterUser-subtitle">your account</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="RegisterUser-input-field"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="RegisterUser-input-field"
            />
            <div className="RegisterUser-phone-wrapper">
              <span className="RegisterUser-phone-prefix">+91</span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: onlyNumbers });
                }}
                className="RegisterUser-phone-input"
                maxLength={10}
              />
            </div>

            <button
              className="RegisterUser-continue-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "CONTINUE"}
            </button>

            {message && <p className="RegisterUser-message">{message}</p>}

            <p className="RegisterUser-sign-up-text">or sign up with</p>

            <div className="RegisterUser-social-buttons">
              <button className="RegisterUser-social-btn">
                <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" />
              </button>
              <button className="RegisterUser-social-btn" onClick={handleGoogleLogin}>
                <GoogleIcon />
              </button>
              <button className="RegisterUser-social-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
              </button>
            </div>

            <p className="Alreadylogin-text">
              Already have an account?
              <span
                className="login-link"
                onClick={() => {
                  setShowB2UModal(false);
                  setShowLoginModal(true);
                }}
              >
                &nbsp; Log In
              </span>
            </p>
          </>
        ) : (
          <OtpVerification
            phone={phone}
            name={formData.name}
            email={formData.email}
            mode="register"
            onBack={() => setShowOtpStep(false)}
            setShowB2UModal={setShowB2UModal}  
            setShowLoginModal={setShowLoginModal}
            // Pass setters to OTP component to update auth context on successful OTP verification
            setUser={setUser}
            setToken={setToken}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </div>

      <div className="RegisterUser-image-section">
        <img src={img1} alt="Fashion Model" />
      </div>
    </div>
  );
};

export default SignupForm;




