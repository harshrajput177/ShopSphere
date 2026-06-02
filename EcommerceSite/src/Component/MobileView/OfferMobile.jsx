import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoChevronBack } from "react-icons/io5";
import { fetchAllCoupons } from "../Store/Slices/CouponSlice"; // sirf yeh
import { RiDiscountPercentLine, RiPriceTag3Line, RiGiftLine, RiCoupon3Line } from "react-icons/ri";
import { LuCopy, LuCopyCheck, LuClock3 } from "react-icons/lu";

import "../../Style-CSS/MobileView/OfferMobile.css";

const OffersMobileView = ({ onClose }) => {
  const dispatch = useDispatch();
  const { available } = useSelector((state) => state.coupon);
  const [activeTab, setActiveTab] = useState("all");
  const [copied, setCopied] = useState(null);

  const getIconAndColor = (discountType) => {
  if (discountType === "percent") return { icon: <RiDiscountPercentLine size={22} />, colorClass: "amber" };
  if (discountType === "flat")    return { icon: <RiPriceTag3Line size={22} />,        colorClass: "purple" };
  return                                 { icon: <RiGiftLine size={22} />,              colorClass: "green" };
};

  useEffect(() => {
    dispatch(fetchAllCoupons()); // ✅ sirf yeh, fetchProductCoupons hata do
  }, [dispatch]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const now = new Date();

  const filtered = available.filter((c) => {
    const expired = c.expiryDate && new Date(c.expiryDate) < now; // ✅ expiresAt → expiryDate
    if (activeTab === "all") return !expired;
    if (activeTab === "expired") return expired;
    return false;
  });

  return (
    <div className="offers-fullscreen">
      <div className="offers-header">
        <button className="offers-back-btn" onClick={onClose}>
          <IoChevronBack size={20} />
        </button>
        <h1>Offers &amp; Coupons</h1>
      </div>

      <div className="offers-banner">
        <div>
          <p className="offers-banner-tag">Limited time</p>
          <h2>Save up to 40%</h2>
          <p>On your next order</p>
        </div>
        <span>🎁</span>
      </div>

      <div className="offers-tabs">
        {["all", "applied", "expired"].map((tab) => (
          <button
            key={tab}
            className={`offers-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="offers-list">
      {filtered.map((coupon) => {
  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < now;
  const { icon, colorClass } = getIconAndColor(coupon.discountType);

  return (
    <div key={coupon._id} className={`ccard ${isExpired ? "expired-overlay" : ""}`}>
      <div className="ccard-body">

        <div className={`icon-wrap ${colorClass} ${isExpired ? "faded" : ""}`}>
          {icon}
        </div>

        <div className="ccard-info">
          <p className="ccard-title">{coupon.description}</p>
          <div className="ccard-sub">
            <span>
              {coupon.discountType === "percent"
                ? `${coupon.discountValue}% off`
                : `Flat ₹${coupon.discountValue} off`}
            </span>
            {coupon.minOrderAmount > 0 && (
              <><span className="dot" /><span>Min ₹{coupon.minOrderAmount}</span></>
            )}
            {coupon.maxDiscount && coupon.discountType === "percent" && (
              <><span className="dot" /><span className="savings-badge">Save up to ₹{coupon.maxDiscount}</span></>
            )}
            {isExpired && (
              <><span className="dot" /><span className="expired-badge">Expired</span></>
            )}
          </div>
        </div>

      </div>

      <div className="ccard-footer">
        <div className="code-wrap">
          <div className="code-pill">
            <RiCoupon3Line size={14} style={{ color: "#888", flexShrink: 0 }} />
            {coupon.code}
          </div>
          {coupon.expiryDate && (
            <div className="expiry">
              <LuClock3 size={11} />
              Expires {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
            </div>
          )}
        </div>

        {!isExpired && (
          <button className="copy-btn" onClick={() => handleCopy(coupon.code)}>
            {copied === coupon.code
              ? <><LuCopyCheck size={15} /> Copied!</>
              : <><LuCopy size={15} /> Copy</>
            }
          </button>
        )}
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
};

export default OffersMobileView;