import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../Style-CSS/Order/ProfileLayout.css";

const ProfileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Orders",
      path: "/orders",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
  ];

  // Active check — /order/:id bhi "Orders" ko active rakhega
  const isActive = (path) => {
    if (path === "/orders") {
      return location.pathname === "/orders" || location.pathname.startsWith("/order/");
    }
    return location.pathname === path;
  };

  return (
    <div className="profile-layout">
      {/* ── Left Sidebar ── */}
      <aside className="profile-sidebar">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`sidebar-item ${isActive(item.path) ? "sidebar-item-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Right Content ── */}
      <main className="profile-content">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;