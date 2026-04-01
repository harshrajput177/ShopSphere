import { FaArrowLeftLong } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import "../../Style-CSS/Navbarbottom.css"

const AccountHeader = ({ onClose }) => {
  return (
    <div className="account-header-bar">

      {/* LEFT */}
      <FaArrowLeftLong
        className="header-icon" 
        onClick={onClose}
      />

      {/* CENTER LOGO */}
      <h2 className="header-logo">
        NYKAA <span>FASHION</span>
      </h2>

      {/* RIGHT ICONS */}
      <div className="header-right">
        <CiHeart className="header-icon" />
        <CiShoppingCart className="header-icon" />
      </div>

    </div>
  );
};

export default AccountHeader;