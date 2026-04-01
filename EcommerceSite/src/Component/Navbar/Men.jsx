import React from "react";
import "../../Style-CSS/Navbar-css/MegaMenu.css";

const Men = ({ onEnter, onLeave }) => {
  return (
<div
  className="mega-menu-f"
  onMouseEnter={onEnter}
  onMouseLeave={onLeave}
>
  <div className="mega-container">

    <div className="mega-column">
      <h4>Topwear</h4>
      <p>T-Shirts</p>
      <p>Casual Shirts</p>
      <p>Formal Shirts</p>
      <p>Sweatshirts</p>
      <p>Jackets</p>
    </div>

    <div className="mega-column">
      <h4>Bottomwear</h4>
      <p>Jeans</p>
      <p>Casual Trousers</p>
      <p>Shorts</p>
      <p>Track Pants</p>
    </div>

    <div className="mega-column">
      <h4>Footwear</h4>
      <p>Casual Shoes</p>
      <p>Sneakers</p>
      <p>Flip Flops</p>
      <p>Sandals</p>
    </div>

    <div className="mega-column">
      <h4>Sports & Active Wear</h4>
      <p>Sports Shoes</p>
      <p>Track Pants</p>
      <p>Active T-Shirts</p>
    </div>

    <div className="mega-column">
      <h4>Fashion Accessories</h4>
      <p>Wallets</p>
      <p>Belts</p>
      <p>Perfumes</p>
      <p>Caps</p>
    </div>

  </div>
</div>
  );
};

export default Men;