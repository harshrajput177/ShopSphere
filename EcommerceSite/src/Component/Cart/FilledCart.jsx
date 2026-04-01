import React from "react";
import "../../Style-CSS/Cart/FilledCart.css";
import { X, Trash2 } from "lucide-react";
import { FaCheckCircle, FaShieldAlt, FaUndo } from "react-icons/fa";

const CartDrawer = ({ onClose }) => {
  return (
    <div className="Filled-cart-overlay"  onClick={(e) => e.stopPropagation()}>
      <div className="Filled-cart-container"  >

        {/* Header */}
        <div className="Filled-cart-header">
          <h2>Bag</h2>
          <X className="close-icon"  onClick={onClose}/>
        </div>

        <div  className="Filled-cart-body">

        {/* Product */}
        <div className="Filled-cart-product">
          <img
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
            alt="product"
          />

          <div className="Filled-product-details">
            <h4>Campus Sutra</h4>
            <p>Mens Onyx Black Textured...</p>

            <div className="Filled-product-options">
              <span>Size 32</span>
              <span>Qty 1 ▼</span>
            </div>

            <p className="return">7 Day Return</p>
          </div>

          <span >  <Trash2 className="remove-icon" /></span>
        </div>

        {/* Price */}
        <div className="Filled-cart-price">
          <span>You Pay   <span>:</span></span>
          <h3>₹1,000</h3>
          <p className="discount">50% off <span className="discount-old-price">₹1,999</span></p>
        </div>

        {/* Coupons */}
        <div className="Filled-cart-coupon">
          <div  className="Apply-coupons">
            <h4>Coupons</h4>
            <p>Apply Coupons and save extra</p>
          </div>
          <span>›</span>
        </div>

        {/* Summary */}
        <div className="Filled-price-summary">
          <h4>Price Summary</h4>
          <p className="tax">Prices are inclusive of all taxes</p>

          <div className="row">
            <span>Bag Total (1 items)</span>
            <span>₹1,999</span>
          </div>

          <div className="row green">
            <span>Discount on MRP</span>
            <span>-₹999</span>
          </div>

          <div className="row">
            <span>Sub Total</span>
            <span>₹1,000</span>
          </div>

          <div className="row">
            <span>Convenience Charges</span>
            <span className="green">Free</span>
          </div>

          <div className="row total">
            <span>You Pay </span>
            <span>₹1,000</span>
          </div>

          <div className="saving">
            ✔ Yay! You are saving ₹999.
          </div>
        </div>

        {/* Trust Section */}
<div className="cart-trust">
  <div className="trust-item">
    <FaCheckCircle className="icon-footer-cart"/> <span>Genuine <br />products</span>
  </div>
  <div className="trust-item">
    <FaShieldAlt  className="icon-footer-cart"/> <span>Secure <br />payments</span>
  </div>
  <div className="trust-item">
    <FaUndo  className="icon-footer-cart"/> <span>Easy <br />returns</span>
  </div>
</div>

{/* Saving Bar */}
<div className="cart-saving-bar">
  You saved ₹999 on this purchase
</div>

        {/* Bottom */}
        <div className="Filled-cart-footer">
          <div>
            <h3>₹1,000</h3>
            <p>View Details</p>
          </div>
          <button>Proceed to Buy</button>
        </div>
</div>
      </div>
    </div>
  );
};

export default CartDrawer;