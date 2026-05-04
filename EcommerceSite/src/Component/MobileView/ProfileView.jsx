import React from "react";
import { useSelector } from "react-redux";
import "../../Style-CSS/MobileView/ProfileView.css";
import { FaArrowLeft, FaCheckCircle, FaPen } from "react-icons/fa";

const ProfilePage = ({ onBack }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <FaArrowLeft onClick={onBack} />
        <h2>My Profile</h2>
      </div>

      {/* PROFILE IMAGE */}
      <div className="profile-image-section">
        <div className="profile-avatar">
          <FaPen className="edit-icon" />
        </div>
      </div>

      {/* MOBILE */}
      <div className="profile-field">
        <label>Mobile number</label>
        <p>{user?.phone}</p>
      </div>
      <span className="verified">
        Your mobile number is verified <FaCheckCircle />
      </span>

      {/* EMAIL */}
      <div className="profile-field">
        <label>Email address</label>
        <p>{user?.email || "Add email"}</p>
      </div>
      <span className="verified">
        Your email address is verified <FaCheckCircle />
      </span>

      {/* NAME */}
      <div className="profile-field">
        <label>Name</label>
        <p>{user?.name}</p>
      </div>

      {/* GENDER */}
      <div className="profile-field">
        <label>Gender</label>
        <p>Select Gender</p>
      </div>

      {/* DOB */}
      <div className="profile-field">
        <label>Date Of Birth</label>
        <p>Select DOB</p>
      </div>

    </div>
  );
};

export default ProfilePage;