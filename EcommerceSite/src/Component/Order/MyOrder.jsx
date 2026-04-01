import { useState, useEffect } from "react";
import axios from "axios"; // Import axios for HTTP requests
import "../MyOrder/MyOrder.css";
import { useAuth } from "../../ContextApiCart/LoginContextApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../Pages/LoaderFullpage";


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();


  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  // Fetch orders from the backend
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // ya jahan tu token store kar raha ho

      const response = await axios.get(`${baseURL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 token bhejna zaroori hai
        },
      });

      setOrders(response.data); // Set the orders from the backend
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  fetchOrders();
}, []);


  if (loading) {
    return <Loader />; // Show loading state while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div className="order-container-c-p-d">
      <div className="tabs">
        {["Pending", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`tab-button ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {orders.filter(order => order.status.toLowerCase() === filter.toLowerCase()).map((order) => (
        <div key={order._id} className="order-c-p-d-card"> {/* Use _id instead of id */}
          <div className="order-image">
          <img   loading="lazy" src={`${baseURL}/uploads/${order.items[0]?.image}`} alt={order.items[0]?.title} className="order-images" />

          </div>
          <div className="order-details">
            <h2 className="All-order-title">Order #{order._id}</h2> 
            <p className="Ordername">{order.items[0]?.title}</p>
            <p className="Order-Size-Color">
              Size: {order.items[0]?.size} | Color: {order.items[0]?.color} | Quantity: {order.items[0]?.quantity}
            </p>
          </div>
          <div className="order-summary">
            <p>{new Date(order.createdAt).toLocaleDateString()}</p> {/* Display order date */}
            <p>Tracking number: <strong>{order.trackingNumber || "N/A"}</strong></p>
            <p>Subtotal: <strong>Rs.{order.amount}</strong></p> {/* Display total amount */}
            <p className="order-status">{order.status.toUpperCase()}</p>
            <button className="details-button"    onClick={() => navigate(`/orders/${order._id}`)}>Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;

