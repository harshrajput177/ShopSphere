import React, { useEffect, useState } from "react";
import { useDispatch, useSelector }   from "react-redux";
import { useParams, useNavigate }     from "react-router-dom";
import { fetchOrderById, cancelOrder } from "../Store/Slices/orderSlice";
import "../../Style-CSS/Order/OrderDeatils.css";

const STEPS = ["Confirmed", "Packed", "Shipped", "Delivered"];

const CANCEL_REASONS = [
  "Changed my mind",
  "Found better price elsewhere",
  "Ordered by mistake",
  "Delivery time too long",
  "Other",
];

const OrderDetail = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeOrder: order, loading } = useSelector((s) => s.order);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  if (loading || !order) {
    return (
      <>
        {/* Mobile Header */}
        <div className="orderdetail-mobile-header">
          <button className="orderdetail-back-btn" onClick={() => navigate("/orders")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="orderdetail-header-title">Order Details</span>
          <div style={{ width: 36 }} />
        </div>
        <p className="order-detail-loading">Loading order details…</p>
      </>
    );
  }

  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const fillPercent = Math.max(0, (currentStep / (STEPS.length - 1)) * 76);

  const canCancel = ["Pending", "Confirmed", "Packed"].includes(order.status);

  const handleCancel = async () => {
    if (!cancelReason) return alert("Please select a reason");
    await dispatch(cancelOrder({ id: order._id, reason: cancelReason }));
    setCancelModal(false);
  };

  return (
    <div className="order-detail-page">

      {/* ── Nykaa-style Mobile Header ── */}
      <div className="orderdetail-mobile-header">
        <button className="orderdetail-back-btn" onClick={() => navigate("/orders")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="orderdetail-header-title">Order Details</span>
        {canCancel ? (
          <button className="orderdetail-header-cancel-btn" onClick={() => setCancelModal(true)}>
            Cancel
          </button>
        ) : (
          <div style={{ width: 56 }} />
        )}
      </div>

      <div className="order-detail-inner">

        {/* Desktop back button — hidden on mobile */}
        <button className="btn-back btn-back-desktop" onClick={() => navigate("/orders")}>
          ← Back to Orders
        </button>

        {/* Desktop Header */}
        <div className="order-detail-header">
          <div>
            <h2 className="order-detail-title">{order.orderNumber}</h2>
            <p className="order-detail-placed">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          {canCancel && (
            <button className="btn-cancel-order btn-cancel-desktop" onClick={() => setCancelModal(true)}>
              Cancel Order
            </button>
          )}
        </div>

        {/* Mobile order number + date — shown below header on mobile */}
        <div className="order-detail-mobile-meta">
          <p className="order-detail-mobile-id">{order.orderNumber}</p>
          <p className="order-detail-mobile-date">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

        {/* ── Order Tracker ── */}
        {!isCancelled && (
          <div className="order-tracker-card">
            <div className="tracker-steps">
              <div className="tracker-line-bg" />
              <div
                className="tracker-line-fill"
                style={{ width: `${fillPercent}%` }}
              />
              {STEPS.map((step, i) => {
                const isActive  = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step} className="tracker-step">
                    <div className={`tracker-dot ${isCurrent ? "current" : isActive ? "active" : "inactive"}`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <p className={`tracker-label ${isActive ? "active-label" : "inactive-label"}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>

            {order.expectedDelivery && order.status !== "Delivered" && (
              <p className="tracker-expected">
                Expected delivery:{" "}
                <strong>
                  {new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </strong>
              </p>
            )}
          </div>
        )}

        {/* ── Cancelled Banner ── */}
        {isCancelled && (
          <div className="order-cancelled-banner">
            <p className="order-cancelled-title">Order Cancelled</p>
            <p className="order-cancelled-reason">{order.cancelReason}</p>
          </div>
        )}

        {/* ── Order Items ── */}
        <div className="section-card">
          <p className="section-card-title">Order Items</p>
          {order.items.map((item, i) => (
            <div key={i} className="order-detail-item">
              <img src={item.image} alt={item.title} className="order-detail-item-img" />
              <div className="order-detail-item-info">
                <p className="order-detail-item-title">{item.title}</p>
                <p className="order-detail-item-meta">
                  Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                </p>
                <div className="order-detail-item-prices">
                  <p className="item-price-final">₹{item.price}</p>
                  {item.originalPrice && (
                    <p className="item-price-original">₹{item.originalPrice}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Address + Payment Grid ── */}
        <div className="order-detail-grid">
          <div className="section-card">
            <p className="section-card-title">Delivery Address</p>
            <div className="address-body">
              <p className="address-name">{order.shippingAddress.name}</p>
              <p className="address-line">
                {order.shippingAddress.address}, {order.shippingAddress.locality}
              </p>
              <p className="address-line">
                {order.shippingAddress.city} — {order.shippingAddress.pincode}
              </p>
              <p className="address-phone">📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="section-card">
            <p className="section-card-title">Payment Info</p>
            <div className="payment-body">
              <div className="payment-row">
                <span>Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="payment-row">
                <span>Status</span>
                <span className={
                  order.paymentStatus === "Paid"
                    ? "payment-status-paid"
                    : "payment-status-unpaid"
                }>
                  {order.paymentStatus}
                </span>
              </div>
              <hr className="payment-divider" />
              <div className="payment-row">
                <span>Items total</span>
                <span>₹{order.itemsTotal}</span>
              </div>
              <div className="payment-row">
                <span>Delivery</span>
                <span>
                  {order.deliveryCharge === 0
                    ? <span className="payment-free-tag">FREE</span>
                    : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="payment-total-row">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cancel Modal ── */}
        {cancelModal && (
          <div className="cancel-modal-overlay">
            <div className="cancel-modal">
              <h3 className="cancel-modal-title">Cancel Order?</h3>
              <p className="cancel-modal-subtitle">
                Please tell us why you want to cancel this order.
              </p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="cancel-reason-select"
              >
                <option value="">Select a reason</option>
                {CANCEL_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="cancel-modal-actions">
                <button className="btn-keep-order" onClick={() => setCancelModal(false)}>
                  Keep Order
                </button>
                <button className="btn-confirm-cancel" onClick={handleCancel}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetail;