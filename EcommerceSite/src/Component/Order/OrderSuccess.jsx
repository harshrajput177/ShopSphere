import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Receipt,
  Package,
  Truck,
  Home,
  ListChecks,
  ShoppingBag,
} from "lucide-react";
import "../../Style-CSS/Order/OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const steps = [
    { label: "Confirmed", icon: <CheckCircle size={16} />, done: true },
    { label: "Packed",    icon: <Package size={16} />,     done: true },
    { label: "Shipped",   icon: <Truck size={16} />,       done: false },
    { label: "Delivered", icon: <Home size={16} />,        done: false },
  ];

  return (
    <div className="os-page">
      <div className="os-card">

        <div className="os-icon-wrap">
          <CheckCircle size={38} strokeWidth={1.8} />
        </div>

        <div className="os-gold-bar" />

        <h1 className="os-title">Order Placed!</h1>
        <p className="os-subtitle">
          Thank you for your purchase. Your order has been confirmed and is
          being prepared.
        </p>

        <div className="os-order-box">
          <div>
            <p className="os-order-label">Order ID</p>
            <p className="os-order-id">#{id}</p>
          </div>
          <Receipt size={22} strokeWidth={1.6} className="os-receipt-icon" />
        </div>

        <div className="os-steps">
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="os-step">
                <div className={`os-step-dot ${step.done ? "done" : "pending"}`}>
                  {step.icon}
                </div>
                <span className={`os-step-label ${step.done ? "done" : ""}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`os-step-line ${step.done && steps[i + 1].done ? "done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <button className="os-btn-primary" onClick={() => navigate("/orders")}>
          <ListChecks size={16} strokeWidth={2} />
          View My Orders
        </button>

        <button className="os-btn-ghost" onClick={() => navigate("/")}>
          <ShoppingBag size={16} strokeWidth={2} />
          Continue Shopping
        </button>

      </div>
    </div>
  );
};

export default OrderSuccess;