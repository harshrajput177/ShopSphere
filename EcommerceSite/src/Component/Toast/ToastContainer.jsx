import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiLock, FiX } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineRule } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";

const STYLES = {
  success:  { bg: "#f0faf4", border: "#b4e4c8", color: "#1a6640", iconBg: "#d3f2e2", bar: "#2ecc71" },
  error:    { bg: "#fff3f3", border: "#f5c1c1", color: "#9a2020", iconBg: "#fde0e0", bar: "#e74c3c" },
  wishlist: { bg: "#fff0f5", border: "#f4b8d0", color: "#8a1a48", iconBg: "#fdd6ea", bar: "#e91e8c" },
  info:     { bg: "#f0f5ff", border: "#b5cff7", color: "#1a3d8a", iconBg: "#dce8fd", bar: "#2d7ef5" },
  warning:  { bg: "#fffbf0", border: "#f5d97a", color: "#7a5200", iconBg: "#fdeea8", bar: "#f0a500" },
};

const ICON_MAP = {
  bag:     <FiShoppingBag size={16} />,
  heart:   <FaHeart size={15} />,
  unheart: <FaRegHeart size={15} />,
  lock:    <FiLock size={16} />,
  ruler:   <MdOutlineRule size={16} />,
  coupon:  <RiCoupon3Line size={16} />,
  check:   (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const s = STYLES[toast.type] || STYLES.info;

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    const timer = setTimeout(() => dismiss(), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setHiding(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "13px 14px",
        borderRadius: "12px",
        minWidth: "280px",
        maxWidth: "360px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1.5px 5px rgba(0,0,0,0.07)",
        transform: visible && !hiding ? "translateY(0) scale(1)" : "translateY(-48px) scale(0.94)",
        opacity: visible && !hiding ? 1 : 0,
        transition: hiding
          ? "transform 0.26s ease-in, opacity 0.22s ease-in"
          : "transform 0.38s cubic-bezier(0.34,1.3,0.64,1), opacity 0.28s ease",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: s.iconBg, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {ICON_MAP[toast.icon] || ICON_MAP.check}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{toast.title}</p>
        {toast.message && (
          <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 400, opacity: 0.78, lineHeight: 1.35 }}>
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        style={{
          background: "none", border: "none", cursor: "pointer",
          opacity: 0.4, color: "inherit", padding: 2,
          display: "flex", alignItems: "center", flexShrink: 0,
        }}
      >
        <FiX size={14} />
      </button>

      <div
        style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2.5, background: s.bar,
          animation: `toastProgress ${toast.duration || 3000}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;