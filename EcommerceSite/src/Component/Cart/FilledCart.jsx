import { useSelector, useDispatch } from "react-redux";
import CouponSheet from "./CouponSheetCom2";
import { fetchCart, removeCart, addCart } from "../Store/Slices/cartSlice";
import "../../Style-CSS/Cart/FilledCart.css";
import { X, Trash2 } from "lucide-react";
import { FaCheckCircle, FaShieldAlt, FaUndo } from "react-icons/fa";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeCoupon } from "../Store/Slices/CouponSlice";
import { useState } from "react";

const CartDrawer = ({ onClose }) => {
const dispatch = useDispatch();
const navigate = useNavigate(); 
const cartItems = useSelector((state) => state.cart.items);
const { user } = useSelector((state) => state.auth);

const [showCouponSheet, setShowCouponSheet] = useState(false);
const { applied: appliedCoupon, discount: couponDiscount } = useSelector(s => s.coupon);

useEffect(() => {
  dispatch(fetchCart());  
}, [dispatch]);

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

const finalTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) - couponDiscount;


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

    <>
      {cartItems.map((item, i) => (
  <div className="Filled-cart-product" key={i}>
    <img src={item.image} alt="product" />

    <div className="Filled-product-details">
      <h4>{item.title}</h4>

   <div className="Filled-product-options">
  <span className="size-pill">Size {item.size}</span>

  <div className="qty-box">
    <button
      className="qty-btn"
      onClick={() =>
        dispatch(removeCart({
          productId: item.productId,
          size: item.size,
        }))
      }
    >
      −
    </button>

    <span className="qty-value">{item.qty}</span>

    <button
      className="qty-btn"
      onClick={() =>
        dispatch(addCart({
          productId: item.productId,
          size: item.size,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          title: item.title,
        }))
      }
    >
      +
    </button>
  </div>
</div>

      <p className="return">7 Day Return</p>
    </div>

<div
  className="cart-remove-btn"
  onClick={() =>
    dispatch(removeCart({
      productId: item.productId,
      size: item.size,
    }))
  }
>
  <Trash2 size={16} />
</div>
  </div>
))}
 

          <div className="Filled-cart-price">
            <span>You Pay :</span>
            <h3>₹{finalTotal}</h3>

            <p className="cart-discount">
              {Math.round((totalDiscount / bagTotal) * 100) || 0}% off
              <span className="discount-old-price">
                ₹{bagTotal}
              </span>
            </p>
          </div>

          {/* Coupons */}
       <div className="Filled-cart-coupon" onClick={() => setShowCouponSheet(true)}>
  <div className="Apply-coupons">
    <h4>Coupons</h4>
    {appliedCoupon ? (
      <p style={{ color: "#2e7d32", fontSize: "12px", marginTop: "2px" }}>
        {appliedCoupon} applied — saving ₹{couponDiscount}
      </p>
    ) : (
      <p>Apply coupons and save extra</p>
    )}
  </div>
  {appliedCoupon && (
    <span className="applied-badge">
      Applied
    </span>
  )}
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

            {appliedCoupon && (
  <div className="row green">
    <span>{appliedCoupon} coupon</span>
    <span>-₹{couponDiscount}</span>
  </div>
)}

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

          <div className="cart-saving-bar">
  ✔ Yay! You saved ₹{totalDiscount + couponDiscount} on this purchase
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
  ✔ Yay! You saved ₹{totalDiscount + couponDiscount} on this purchase
</div>

<div className="Filled-cart-footer">
  <div>
    <h3>₹{finalTotal}</h3>
    <p>View Details</p>
  </div>
  <button
    onClick={() => {
  if (!user) {          // ← isAuthenticated ki jagah user check karo
    navigate("?auth=login");
    onClose();
    return;
  }
  onClose();
  navigate("/checkout");
}}
  >
    Proceed to Buy ({cartItems.length})
  </button>
</div>
             </>
  )}
        </div>

      </div>
      {showCouponSheet && (
  <CouponSheet
    onClose={() => setShowCouponSheet(false)}
    finalTotal={finalTotal + couponDiscount}
    cartItems={cartItems}
  />
)}
    </div>
  );
};

export default CartDrawer;