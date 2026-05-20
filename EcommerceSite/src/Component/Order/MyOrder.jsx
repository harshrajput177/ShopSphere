import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../Store/Slices/OrderSlice";
import ProfileLayout from "./ProfileLayout";
import "../../Style-CSS/Order/MyOrder.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusClass = (status) => {
    const map = {
      "Pending":          "status-Pending",
      "Confirmed":        "status-Confirmed",
      "Shipped":          "status-Shipped",
      "Delivered":        "status-Delivered",
      "Cancelled":        "status-Cancelled",
      "Return Requested": "status-Return-Requested",
    };
    return map[status] || "";
  };

  if (loading) {
    return (
      <>
        <div className="myorders-mobile-header">
          <button className="myorders-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="myorders-header-title">Orders</span>
          <div style={{ width: 36 }} />
        </div>
        <div className="orders-loading">
          <div className="orders-loading-spinner" />
          <p>Fetching your orders…</p>
        </div>
      </>
    );
  }

  if (!orders.length) {
    return (
      <>
        <div className="myorders-mobile-header">
          <button className="myorders-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="myorders-header-title">Orders</span>
          <div style={{ width: 36 }} />
        </div>
        <ProfileLayout>
          <div className="my-orders-page">
            <div className="my-orders-inner">
              <div className="orders-empty">
                <span className="orders-empty-icon">🛍️</span>
                <h3>No orders yet</h3>
                <p>Looks like you haven't placed any orders. Start exploring!</p>
                <button className="btn-shop-now" onClick={() => navigate("/")}>Shop Now</button>
              </div>
            </div>
          </div>
        </ProfileLayout>
      </>
    );
  }

  return (
    <>
      {/* Mobile-only header */}
      <div className="myorders-mobile-header">
        <button className="myorders-back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="myorders-header-title">Orders</span>
        <div style={{ width: 36 }} />
      </div>

      {/* Desktop: left sidebar + right orders list */}
      <ProfileLayout>
        <div className="my-orders-page">
          <div className="my-orders-inner">
            <p className="myorders-subcount">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

            {orders.map((order) => (
              <div
                key={order._id}
                className="order-card"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <div className="order-card-header">
                  <div>
                    <p className="order-card-id-label">Order ID</p>
                    <p className="order-card-id-value">{order.orderNumber}</p>
                  </div>
                  <div className="order-card-meta-right">
                    <p className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <p className="order-card-amount">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="order-card-items">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="order-card-item-row">
                      <img src={item.image} alt={item.title} className="order-item-img" />
                      <div className="order-item-info">
                        <p className="order-item-title">{item.title}</p>
                        <p className="order-item-meta">Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}</p>
                        <p className="order-item-price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="order-more-items">+{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}</p>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {order.status === "Shipped" && order.expectedDelivery && (
                      <span className="order-expected-delivery">
                        By {new Date(order.expectedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    <span className="order-card-arrow">›</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileLayout>
    </>
  );
};

export default MyOrders;