import React, { useEffect, useState } from "react";
import { useDispatch, useSelector }    from "react-redux";
import { useNavigate }                 from "react-router-dom";
import axios                           from "axios";
import { fetchAddresses, setSelectedAddress } from "../Store/Slices/addressSlice";
import { placeOrder, placeRazorpayOrder }     from "../Store/Slices/OrderSlice";
import { clearCart }                          from "../Store/Slices/cartSlice";
import { removeCoupon } from "../Store/Slices/CouponSlice.js";
import AddressForm from "./Address";
import "../../Style-CSS/Order/CheckOut.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, authChecked }   = useSelector((s) => s.auth);
  const { addresses, selected } = useSelector((s) => s.address);
  const { items: cartItems }    = useSelector((s) => s.cart);
  const { placing, error }      = useSelector((s) => s.order);

  const [paymentMethod,    setPaymentMethod]    = useState("Razorpay");
  const [showAddForm,      setShowAddForm]      = useState(false);
  const [mobileStep,       setMobileStep]       = useState("address");
  const [locationData,     setLocationData]     = useState(null);
  const [locationLoading,  setLocationLoading]  = useState(false);
  const [locationError,    setLocationError]    = useState("");

  const { applied: appliedCoupon, discount: couponDiscount } = useSelector((s) => s.coupon);
  const itemsTotal     = cartItems.reduce((sum, i) => sum + i.price * (i.qty || i.quantity || 1), 0);
const deliveryCharge = itemsTotal >= 499 ? 0 : 49;
const totalAmount    = itemsTotal + deliveryCharge - couponDiscount;  // ← coupon minus karo

  useEffect(() => {
    if (!authChecked) return;
    if (!user) { navigate("?auth=login"); return; }
    dispatch(fetchAddresses());
  }, [authChecked, user, dispatch, navigate]);

  if (!authChecked) {
    return <div className="loading-screen">Loading your experience…</div>;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <div className="checkout-mobile-header">
          <button className="checkout-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="checkout-header-title">Checkout</span>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="empty-cart-btn" onClick={() => navigate("/")}>
            Explore Collection
          </button>
        </div>
      </>
    );
  }
  // ── Place Order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selected) return alert("Please select a delivery address.");
   const orderData = {
  items: cartItems.map((i) => ({
    product:       i.productId,
    title:         i.title,
    image:         i.image,
    size:          i.size,
    quantity:      i.qty || i.quantity || 1,
    price:         i.price,
    originalPrice: i.originalPrice,
  })),
  shippingAddress: {
    name:     selected.name,
    phone:    selected.phone,
    address:  selected.address,
    locality: selected.locality,
    city:     selected.city,
    state:    selected.state,
    pincode:  selected.pincode,
    landmark: selected.landmark || "",
  },
  paymentMethod,
  itemsTotal,
  deliveryCharge,
  couponCode:     appliedCoupon   || null,   
  couponDiscount: couponDiscount  || 0,      
  totalAmount,
};

  if (paymentMethod === "COD") {
  const result = await dispatch(placeOrder(orderData));
  if (result.meta.requestStatus === "fulfilled") {
    dispatch(clearCart());
    dispatch(removeCoupon());        // ← yahan add karo
    navigate(`/order-success/${result.payload._id}`);
  }
} else {
  const result = await dispatch(placeRazorpayOrder({ orderData, totalAmount }));
  if (result.meta.requestStatus === "fulfilled") {
    dispatch(clearCart());
    dispatch(removeCoupon());       
    navigate(`/order-success/${result.payload._id}`);
  }
}
  };

  // ── Use My Location ───────────────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported in this browser");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params:  { lat: latitude, lon: longitude, format: "json" },
              headers: { "Accept-Language": "en" },
            }
          );

          const addr = res.data.address;

          setLocationData({
            pincode:  addr.postcode                                   || "",
            city:     addr.city || addr.town || addr.district         || "",
            state:    addr.state                                       || "",
            locality: addr.suburb || addr.neighbourhood || addr.village || "",
            address:  addr.road  || addr.pedestrian                   || "",
          });

          // Form open karo
          setShowAddForm(true);

        } catch {
          setLocationError("Could not fetch location details. Try again.");
        }
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) {
          setLocationError("Location permission denied. Please allow access.");
        } else {
          setLocationError("Could not get your location. Try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      {/* ── Mobile Header ── */}
      <div className="checkout-mobile-header">
        <button className="checkout-back-btn" onClick={() => {
          if (mobileStep === "summary") setMobileStep("address");
          else navigate(-1);
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="checkout-header-title">
          {mobileStep === "summary" ? "Order Summary" : "Checkout"}
        </span>
        <div style={{ width: 36 }} />
      </div>

      {/* ── Mobile Step Tabs ── */}
      <div className="checkout-mobile-steps">
        <div
          className={`mobile-step-tab ${mobileStep === "address" ? "active" : ""}`}
          onClick={() => setMobileStep("address")}
        >
          <span className="step-num">1</span> Address & Payment
        </div>
        <div className="step-divider">›</div>
        <div
          className={`mobile-step-tab ${mobileStep === "summary" ? "active" : ""}`}
          onClick={() => selected && setMobileStep("summary")}
        >
          <span className="step-num">2</span> Summary
        </div>
      </div>

      <div className="checkout-page">
        <div className="checkout-container">

          {/* ====== LEFT COLUMN ====== */}
          <div className={`checkout-left ${mobileStep === "summary" ? "mobile-hidden" : ""}`}>

            <h2 className="checkout-heading">Delivery Address</h2>

            {/* ── Use My Location Button ── */}
            <button
              className="use-location-btn"
              onClick={handleUseMyLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <>
                  <span className="location-spinner" />
                  Detecting location...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
                    <circle cx="12" cy="12" r="8" strokeDasharray="3 2" opacity="0.4"/>
                  </svg>
                  Use My Current Location
                </>
              )}
            </button>

            {locationError && (
              <p className="location-error">{locationError}</p>
            )}

            {addresses.length === 0 && !showAddForm && (
              <div className="no-addr-banner">
                No saved addresses. Please add one below.
              </div>
            )}

            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`address-card ${selected?._id === addr._id ? "selected" : ""}`}
                onClick={() => dispatch(setSelectedAddress(addr))}
              >
                <div className="address-radio">
                  <div className="address-radio-dot" />
                </div>
                <div className="address-card-top">
                  <span className="address-card-name">{addr.name}</span>
                  <span className="address-type-badge">{addr.addressType}</span>
                </div>
                <p className="address-card-line">{addr.address}, {addr.locality}</p>
                <p className="address-card-line">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="address-card-line">{addr.phone}</p>
              </div>
            ))}

        
{!showAddForm && (
  <button
    className="add-address-btn"
    onClick={() => setShowAddForm(true)}
  >
    + Add New Address
  </button>
)}

{showAddForm && (
  <AddressForm
    onClose={() => {
      setShowAddForm(false);
      setLocationData(null);
    }}
    prefillData={locationData}
  />
)}

            {/* ── Payment Method ── */}
            <div className="payment-section">
              <h2 className="checkout-heading">Payment Method</h2>

              <div
                className={`payment-card ${paymentMethod === "Razorpay" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("Razorpay")}
              >
                <div className="payment-radio"><div className="payment-radio-dot" /></div>
                <div className="payment-icon online">💳</div>
                <div>
                  <p className="payment-label">Pay Online</p>
                  <p className="payment-sublabel">UPI · Cards · Net Banking</p>
                </div>
                <span className="payment-badge secure">🔒 Secured</span>
              </div>

              <div
                className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("COD")}
              >
                <div className="payment-radio"><div className="payment-radio-dot" /></div>
                <div className="payment-icon cod">💵</div>
                <div>
                  <p className="payment-label">Cash on Delivery</p>
                  <p className="payment-sublabel">Pay when your order arrives</p>
                </div>
                <span className="payment-badge free">Available</span>
              </div>
            </div>

            <button
              className={`mobile-continue-btn ${!selected ? "disabled" : "active"}`}
              onClick={() => selected && setMobileStep("summary")}
              disabled={!selected}
            >
              Continue to Summary
            </button>
            {!selected && (
              <p className="address-hint">
                <span>📍</span> Select a delivery address to continue
              </p>
            )}
          </div>

          {/* ====== RIGHT COLUMN ====== */}
          <div className={`checkout-right ${mobileStep === "address" ? "mobile-hidden" : ""}`}>
            <div className="order-summary-card">
              <h3 className="order-summary-title">Order Summary</h3>

              {deliveryCharge === 0 && (
                <div className="savings-tag">
                  🎉 You've unlocked FREE delivery on this order!
                </div>
              )}

              {cartItems.map((item, i) => (
                <div key={i} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-details">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-meta">
                      Size: {item.size} · Qty: {item.qty || item.quantity}
                    </p>
                    <p className="cart-item-price">
                      ₹{item.price * (item.qty || item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <hr className="price-divider" />
            <div className="price-row">
  <span>Items total</span>
  <span>₹{itemsTotal}</span>
</div>

<div className="price-row">
  <span>Delivery charges</span>
  <span className={deliveryCharge === 0 ? "free-delivery" : "delivery-paid"}>
    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
  </span>
</div>

{/* ── Coupon row — yeh add karo ── */}
{appliedCoupon && couponDiscount > 0 && (
  <div className="price-row" style={{ color: "green" }}>
    <span>
      Coupon ({appliedCoupon})
      <button
        onClick={() => dispatch(removeCoupon())}
        style={{
          marginLeft: 8,
          fontSize: 11,
          color: "#e53935",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          padding: 0,
        }}
      >
        Remove
      </button>
    </span>
    <span>− ₹{couponDiscount}</span>
  </div>
)}

<hr className="price-divider" />

<div className="price-row total">
  <span>Total</span>
  <span>₹{totalAmount}</span>
</div>

              {selected && (
                <div className="selected-addr-preview">
                  <p className="selected-addr-label">📍 Delivering to</p>
                  <p className="selected-addr-name">{selected.name}</p>
                  <p className="selected-addr-line">
                    {selected.address}, {selected.city} — {selected.pincode}
                  </p>
                  <button
                    className="change-addr-btn"
                    onClick={() => setMobileStep("address")}
                  >
                    Change
                  </button>
                </div>
              )}

              {error && <div className="error-box">⚠ {error}</div>}

              <button
                className={`place-order-btn ${placing || !selected ? "disabled" : "active"}`}
                onClick={handlePlaceOrder}
                disabled={placing || !selected}
              >
                {placing ? "Placing order…" : `Place Order · ₹${totalAmount}`}
              </button>

              {!selected && (
                <p className="address-hint">
                  <span>📍</span> Select a delivery address to continue
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;