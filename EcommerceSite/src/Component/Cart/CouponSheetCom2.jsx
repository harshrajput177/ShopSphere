import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductCoupons, applyCoupon, removeCoupon, clearCouponError } from "../Store/Slices/CouponSlice";
import "../../Style-CSS/Cart/CouponSheet.css";

const CouponSheet = ({ onClose, finalTotal }) => {
  const dispatch = useDispatch();
  const { available, applied, discount, error, loading } = useSelector(s => s.coupon);
  const [inputCode, setInputCode] = useState(applied || "");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchProductCoupons("all"));
  }, []);

  useEffect(() => {
    if (applied) setInputCode(applied);
  }, [applied]);

  const getDaysLeft = (expiry) => {
    const diff = Math.ceil((new Date(expiry) - new Date()) / 86400000);
    if (diff <= 0) return "Expired";
    if (diff === 1) return "Expires today";
    return `Expires in ${diff} days`;
  };

  const calcSaving = (coupon) => {
    if (coupon.discountType === "flat") return coupon.discountValue;
    const pct = (finalTotal * coupon.discountValue) / 100;
    return coupon.maxDiscount ? Math.min(pct, coupon.maxDiscount) : pct;
  };

  const sortedCoupons = [...available].sort((a, b) => calcSaving(b) - calcSaving(a));

  const handleTapApply = (code) => {
    if (applied === code) {
      dispatch(removeCoupon());
      setInputCode("");
      return;
    }
    dispatch(applyCoupon({ code, orderAmount: finalTotal }));
  };

  const handleManualApply = () => {
    const trimmed = inputCode.trim();
    if (!trimmed) return;
    if (applied === trimmed) {
      dispatch(removeCoupon());
      setInputCode("");
      return;
    }
    dispatch(applyCoupon({ code: trimmed, orderAmount: finalTotal }));
  };

  return (
    <div className="cs-overlay" onClick={onClose}>
      <div className="cs-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="cs-header">
          <button className="cs-close" onClick={onClose}>✕</button>
          <h3>Coupons</h3>
          <div style={{ width: 28 }} />
        </div>

        {/* Input */}
        <div className="cs-input-row">
          <input
            className="cs-input"
            value={inputCode}
            onChange={e => { setInputCode(e.target.value.toUpperCase()); dispatch(clearCouponError()); }}
            placeholder="Enter coupon code"
            onKeyDown={e => e.key === "Enter" && handleManualApply()}
          />
          <button className="cs-apply-btn" onClick={handleManualApply} disabled={loading}>
            {loading ? "..." : applied && inputCode === applied ? "Remove" : "Apply"}
          </button>
        </div>

        {error && <p className="cs-error">{error}</p>}

        {/* Success banner */}
        {applied && discount > 0 && (
          <div className="cs-success">
            <span className="cs-success-icon">✓</span>
            <div>
              <p className="cs-success-title">Coupon applied!</p>
              <p className="cs-success-sub">You saved ₹{discount} with {applied}</p>
            </div>
          </div>
        )}

        {/* Coupons list */}
        <div className="cs-section-label">Ready to Apply</div>
        <p className="cs-section-sub">Apply one of these Coupons to save extra</p>

        <div className="cs-list">
          {sortedCoupons.map((c, i) => {
            const saving = Math.round(calcSaving(c));
            const isApplied = applied === c.code;
            const isExpanded = expandedId === c._id;

            return (
              <div className={`cs-card ${isApplied ? "cs-card--applied" : ""}`} key={c._id}>

                {/* Save badge — top right */}
                <div className="cs-save-badge">Save ₹{saving}</div>

                {/* Card body */}
                <div className="cs-card-body">
                  {/* Brand logo placeholder */}
                  <div className="cs-brand-logo">
                    <span className="cs-brand-text">YOUR<br/>BRAND</span>
                  </div>

                  <div className="cs-card-info">
                    <p className="cs-card-title">
                      {c.discountType === "flat"
                        ? `Flat ₹${c.discountValue} off`
                        : `Extra ${c.discountValue}% off${c.maxDiscount ? ` upto ₹${c.maxDiscount}` : ""}`}
                    </p>
                    <p className="cs-card-desc">
                      {isExpanded ? c.description : `${c.description.slice(0, 45)}${c.description.length > 45 ? "..." : ""}`}
                      {c.description.length > 45 && (
                        <span className="cs-see-more" onClick={() => setExpandedId(isExpanded ? null : c._id)}>
                          {isExpanded ? " see less" : " see details"}
                        </span>
                      )}
                    </p>
                    {c.minOrderAmount > 0 && (
                      <p className="cs-card-min">Min order ₹{c.minOrderAmount}</p>
                    )}
                    <p className="cs-card-expiry">{getDaysLeft(c.expiryDate)}</p>
                  </div>
                </div>

                {/* Dashed divider */}
                <div className="cs-dashed-divider">
                  <div className="cs-notch cs-notch--left" />
                  <div className="cs-dashed-line" />
                  <div className="cs-notch cs-notch--right" />
                </div>

                {/* Card footer */}
                <div className="cs-card-foot">
                  <span className="cs-card-code">{c.code}</span>
                  <button
                    className={`cs-tap-btn ${isApplied ? "cs-tap-btn--applied" : ""}`}
                    onClick={() => handleTapApply(c.code)}
                  >
                    {isApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>

              </div>
            );
          })}

          {sortedCoupons.length === 0 && (
            <p className="cs-empty">No coupons available right now</p>
          )}
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default CouponSheet;