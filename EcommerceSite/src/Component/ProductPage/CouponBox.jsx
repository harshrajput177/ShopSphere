import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductCoupons,
  applyCoupon,
  removeCoupon,
  clearCouponError,
} from "../Store/Slices/CouponSlice";

import "../../Style-CSS/ProductPage/CouponBox.css";

const CouponBox = ({ productId, orderAmount }) => {
  const dispatch = useDispatch();

  const { available, applied, discount, error, loading } = useSelector(
    (s) => s.coupon
  );

  const [inputCode, setInputCode] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductCoupons(productId));
    }
  }, [dispatch, productId]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setInputCode(code);
    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  const handleApply = () => {
    if (!inputCode.trim()) return;

    dispatch(
      applyCoupon({
        code: inputCode.trim(),
        orderAmount,
        productId,
      })
    );
  };

  const getDaysLeft = (expiry) => {
    const diff = Math.ceil(
      (new Date(expiry) - new Date()) /
        (1000 * 60 * 60 * 24)
    );

    if (diff <= 0) return "Expired";
    if (diff === 1) return "Expires today";

    return `${diff} days left`;
  };

  return (
    <div className="coupon-box">
      <h3>
        Coupons &bull; {available.length} available
      </h3>

      {/* Coupon List */}
      <div className="coupon-list">
        {available.length === 0 && (
          <p className="coupon-empty">
            No coupons available for this product
          </p>
        )}

        {available.map((c) => (
          <div className="single-coupon" key={c._id}>
            <div className="coupon-header">
              <h4>
                {c.discountType === "flat"
                  ? `Flat ₹${c.discountValue} Off`
                  : `${c.discountValue}% Off${
                      c.maxDiscount
                        ? ` Upto ₹${c.maxDiscount}`
                        : ""
                    }`}
              </h4>

              <span className="coupon-expiry">
                {getDaysLeft(c.expiryDate)}
              </span>
            </div>

            <p
              className="coupon-description"
              title={c.description}
            >
              {c.description}
            </p>

            {c.minOrderAmount > 0 && (
              <p className="coupon-min-order">
                Min Order ₹{c.minOrderAmount}
              </p>
            )}

            <div className="coupon-footer">
              <span className="coupon-code">
                {c.code}
              </span>

              <button
                className="coupon-copy-btn"
                onClick={() => handleCopy(c.code)}
              >
                {copiedCode === c.code
                  ? "Copied!"
                  : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="coupon-input-section">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => {
            setInputCode(
              e.target.value.toUpperCase()
            );
            dispatch(clearCouponError());
          }}
          placeholder="Enter Coupon Code"
          className="coupon-input"
        />

        {applied ? (
          <button
            className="coupon-remove-btn"
            onClick={() => {
              dispatch(removeCoupon());
              setInputCode("");
            }}
          >
            Remove
          </button>
        ) : (
          <button
            className="coupon-apply-btn"
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="coupon-error">
          {error}
        </p>
      )}

      {/* Applied Coupon */}
      {applied && (
        <div className="coupon-applied">
          ✓ <strong>{applied}</strong> applied —
          ₹{discount} off
        </div>
      )}
    </div>
  );
};

export default CouponBox;