import React, { useState } from "react";
import CustomerReviews from "./CustomerReview"; 
import "../../Style-CSS/ProductPage/ProductTab.css";

const tabs = ["Description", "Delivery Details", "Review", ];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");


  return (
    <div className="product-tabs-container">
      {/* Tabs */}
      <div className="ProductTab-tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`ProductTab-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* Content */}
      <div className="ProductTab-tab-content">
        {activeTab === "Description" && (
          <div className="ProductTab-fade-in">
            <h2 className="ProductTab-title">Product Details</h2>

            <p className="ProductTab-desc">
              This Ben Hogan Men's Solid Ottoman Golf Polo Shirt makes for versatile casual wear or golf apparel.
              Built-in moisture wicking and sun protection keep you feeling dry while blocking out harmful UV rays.
              Durable textured Ottoman fabric and a ribbed collar with three-button placket give it classic polo style.
              The solid color makes this golf top easy to pair up with any pants or shorts for style that looks great both on and off the course.
            </p>

            <div className="ProductTab-details-grid">
              <div className="ProductTab-row">
                <span>Package Dimensions</span>
                <span>27.3 x 24.8 x 4.9 cm; 180 g</span>
              </div>

              <div className="ProductTab-row">
                <span>Specification</span>
                <span>Moisture Wicking, Stretchy, SPF/UV Protection, Easy Care</span>
              </div>

              <div className="ProductTab-row">
                <span>Date First Available</span>
                <span>August 08, 2023</span>
              </div>

              <div className="ProductTab-row">
                <span>Department</span>
                <span>Mens</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Delivery Details" && <div className="ProductTab-fade-in">Coming Soon...</div>}
       {activeTab === "Review" && (
  <div className="ProductTab-fade-in">
    <CustomerReviews />
  </div>
)}
   
      </div>
    </div>
  );
};

export default ProductTabs;