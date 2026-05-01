import React from "react";
import "../../Style-CSS/Cart/FilledCart.css";
import { X, Trash2 } from "lucide-react";
import { FaCheckCircle, FaShieldAlt, FaUndo } from "react-icons/fa";
import { useCart } from "../Cart/CartContext";



const CartDrawer = ({ onClose }) => {

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCart();

  const bagTotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0
  );

  const totalDiscount = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.originalPrice || item.price) - item.price) * item.qty,
    0
  );

  const finalTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className="Filled-cart-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="Filled-cart-container"  >

        {/* Header */}
        <div className="Filled-cart-header">
          <h2>Bag</h2>
          <X className="close-icon" onClick={onClose} />
        </div>

        <div className="Filled-cart-body">
    
  {cartItems.length === 0 ? (

    // 🔴 EMPTY CART UI
    <div className="empty-cart">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="empty cart"
        className="empty-cart-img"
      />

      <h3>Your Bag is Empty</h3>
      <p>Add items to it now</p>

      <button
        className="continue-btn"
        onClick={onClose}
      >
        Continue Shopping
      </button>
    </div>

  ) : (

    // 🟢 NORMAL CART ITEMS
    <>
      {cartItems.map((item, i) => (
        <div className="Filled-cart-product" key={i}>
          <img src={item.image} alt="product" />

          <div className="Filled-product-details">
            <h4>{item.title}</h4>

            <div className="Filled-product-options">
              <span>Size {item.size}</span>

              <div className="qty-box">
                <button onClick={() => decreaseQty(item)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item)}>+</button>
              </div>
            </div>

            <p className="return">7 Day Return</p>
          </div>

          <Trash2
            className="remove-icon"
            onClick={() => removeItem(item)}
          />
        </div>
      ))}
 

          <div className="Filled-cart-price">
            <span>You Pay :</span>
            <h3>₹{finalTotal}</h3>

            <p className="discount">
              {Math.round((totalDiscount / bagTotal) * 100) || 0}% off
              <span className="discount-old-price">
                ₹{bagTotal}
              </span>
            </p>
          </div>

          {/* Coupons */}
          <div className="Filled-cart-coupon">
            <div className="Apply-coupons">
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
              <span>Bag Total ({cartItems.length} items)</span>
              <span>₹{bagTotal}</span>
            </div>

            <div className="row green">
              <span>Discount on MRP</span>
              <span>-₹{totalDiscount}</span>
            </div>

            <div className="row">
              <span>Sub Total</span>
              <span>₹{finalTotal}</span>
            </div>

            <div className="row">
              <span>Convenience Charges</span>
              <span className="green">Free</span>
            </div>

            <div className="row total">
              <span>You Pay</span>
              <span>₹{finalTotal}</span>
            </div>

            <div className="saving">
              ✔ Yay! You are saving ₹{totalDiscount}
            </div>


          </div>

          {/* Trust Section */}
          <div className="cart-trust">
            <div className="trust-item">
              <FaCheckCircle className="icon-footer-cart" /> <span>Genuine <br />products</span>
            </div>
            <div className="trust-item">
              <FaShieldAlt className="icon-footer-cart" /> <span>Secure <br />payments</span>
            </div>
            <div className="trust-item">
              <FaUndo className="icon-footer-cart" /> <span>Easy <br />returns</span>
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
             </>
  )}
        </div>

      </div>
    </div>
  );
};

export default CartDrawer;