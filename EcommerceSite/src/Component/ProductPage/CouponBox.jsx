import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductCoupons, applyCoupon, removeCoupon, clearCouponError } from "../Store/Slices/CouponSlice";

const CouponBox = ({ productId, orderAmount }) => {
  const dispatch = useDispatch();
  const { available, applied, discount, error, loading } = useSelector(s => s.coupon);
  const [inputCode, setInputCode] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    if (productId) dispatch(fetchProductCoupons(productId));
  }, [productId]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setInputCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleApply = () => {
    if (!inputCode.trim()) return;
    dispatch(applyCoupon({ code: inputCode.trim(), orderAmount, productId }));
  };

  const getDaysLeft = (expiry) => {
    const diff = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Expired";
    if (diff === 1) return "Expires today";
    return `${diff} days left`;
  };

  return (
    <div className="coupon-box">
      <h3>Coupons &bull; {available.length} available</h3>

      {/* Available coupons list */}
      <div className="coupon-list">
        {available.length === 0 && (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            No coupons available for this product
          </p>
        )}
        {available.map((c) => (
          <div className="single-coupon" key={c._id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h4>
                {c.discountType === "flat"
                  ? `Flat ₹${c.discountValue} off`
                  : `${c.discountValue}% off${c.maxDiscount ? ` upto ₹${c.maxDiscount}` : ""}`}
              </h4>
              <span style={{ fontSize: "11px", color: "#e07b39" }}>{getDaysLeft(c.expiryDate)}</span>
            </div>
            <p>{c.description}</p>
            {c.minOrderAmount > 0 && (
              <p style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                Min order ₹{c.minOrderAmount}
              </p>
            )}
            <div className="coupon-footer">
              <span>{c.code}</span>
              <button onClick={() => handleCopy(c.code)}>
                {copiedCode === c.code ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual input + apply */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <input
          value={inputCode}
          onChange={(e) => { setInputCode(e.target.value.toUpperCase()); dispatch(clearCouponError()); }}
          placeholder="Enter coupon code"
          style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--color-border-primary)", borderRadius: "6px", fontSize: "13px" }}
        />
        {applied ? (
          <button onClick={() => { dispatch(removeCoupon()); setInputCode(""); }}
            style={{ padding: "8px 14px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
            Remove
          </button>
        ) : (
          <button onClick={handleApply} disabled={loading}
            style={{ padding: "8px 14px", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
            {loading ? "..." : "Apply"}
          </button>
        )}
      </div>

      {error && <p style={{ color: "#e53935", fontSize: "12px", marginTop: "6px" }}>{error}</p>}

      {applied && (
        <div style={{ marginTop: "8px", padding: "8px 12px", background: "#e8f5e9", borderRadius: "6px", fontSize: "13px", color: "#2e7d32" }}>
          ✓ <strong>{applied}</strong> applied — ₹{discount} off
        </div>
      )}
    </div>
  );
};

export default CouponBox;