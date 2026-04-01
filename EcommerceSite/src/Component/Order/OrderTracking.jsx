import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../ContextApiCart/LoginContextApi";
import { useNavigate } from "react-router-dom";
import "./OrderTracking.css";

const OrderTracking = () => {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();


  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    if (user?._id) {
      axios
      .get(`${baseURL}/api/orders/user/${user._id}/latest`)

        .then((res) => setOrder(res.data))
        .catch((err) => console.error("Order fetch error:", err));
    }
  }, [user]);

  const handleCancelOrder = async () => {
    if (!order?._id) return;
  
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;
  
    try {
      const res = await axios.put(`${baseURL}/api/orders/cancel/${order._id}`);
      alert("Order cancelled successfully");
      setOrder(res.data.order);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };
  

  if (!order) return <p>No order found.</p>;

  return (
    <div className="orderTracking-container">
      <div className="orderTracking-card">

        <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>

<div  className="productimage-trackingOrder">
<div  className="AllOrders-track">
{order.items.map((item, index) => (
          <div key={index} className="orderTracking-header">
        <img   loading="lazy" className="order-image " src={`${baseURL}/uploads/${item.image}`} alt={item.name} />

            <div className="orderTracking-info">
              <h2 className="order-product-title">{item.title}</h2>
              <p className="order-product-subtitle">
                {item.color}, {item.size}
              </p>
              <p className="order-product-seller">Qty: {item.quantity}</p>
              <h3 className="order-product-price">₹{item.price}</h3>
            </div>
          </div>
        ))}
</div>

<div className="tracking-steps">
  {["confirmed", "shipped", "out_for_delivery", "delivered"].map((step, i) => {
    const statusMap = {
      confirmed: "Order Confirmed",
      shipped: "Shipped",
      out_for_delivery: "Out For Delivery",
      delivered: "Delivered"
    };

    const isActive = order.status === step || ["shipped", "out_for_delivery", "delivered"].includes(step) && (
      ["shipped", "out_for_delivery", "delivered"].indexOf(order.status) >= ["shipped", "out_for_delivery", "delivered"].indexOf(step)
    );

    if (order.status === "cancelled" && step !== "confirmed") return null;

    return (
      <div key={step} className={`step ${isActive ? "active" : "pending"}`}>
        <span className="icon">{isActive ? "✔" : "○"}</span>
        <div>
          <div><strong>{statusMap[step]}</strong></div>
          {step === "confirmed" && (
            <div>Your order has been placed, {new Date(order.createdAt).toDateString()}</div>
          )}
        </div>
      </div>
    );
  })}

  {order.status === "cancelled" && (
    <div className="step cancelled">
      <span className="icon">✖</span>
      <div>
        <div><strong>Order Cancelled</strong></div>
        <div>Your order was cancelled by you.</div>
      </div>
    </div>
  )}
</div>

</div>

        {/* Buttons */}
        <div className="orderTracking-actions">
          <button className="cancel-btn" onClick={handleCancelOrder}>Cancel Order</button>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

