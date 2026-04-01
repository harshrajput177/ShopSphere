import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/OrdersDashboard.css";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    axios.get(`${baseURL}/api/orders/all`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const filteredOrders = activeTab === "All"
    ? orders
    : orders.filter(order => order.status === activeTab.toLowerCase());

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const response = await axios.put(`${baseURL}/api/orders/update-status/${orderId}`, { status: newStatus });

    if (response.data.success) {
      // Update the local state to reflect the new status
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  } catch (error) {
    console.error("Failed to update status", error);
  }
};


  return (
    <div className="main-content">
      <div className="tabs">
        {["All", "Pending", "Shipped", "Delivered"].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Fulfillment</th>
              <th>Payment</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order._id} >
                <td>{order._id}</td>
                <td>{order.userId?.name || "N/A"}</td>
                <td>{order.userId?.email || "N/A"}</td>
                <td>{order.userId?.phone || "N/A"}</td>
                <td>
                 <select
  value={order.status}
  onChange={(e) => handleStatusChange(order._id, e.target.value)}
  className="order-status-dropdown"
>
  <option value="pending">Pending</option>
  <option value="shipped">Shipped</option>
  <option value="delivered">Delivered</option>
  <option value="cancelled">Cancelled</option>
</select>

                </td>
                <td>
                  <span className="badge paid">Paid</span>
                </td>
                <td>₹{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? "active" : ""}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersDashboard;

