import React, { useEffect, useState } from "react";
import CustomerReviews from "./CustomerReview";
import "../../Style-CSS/ProductPage/ProductTab.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const tabs = [
  "Description",
  "Product Details",
  "Delivery Details",
  "Review",
];

const ProductTabs = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("Description");
  const [product, setProduct] = useState(null);

  // 🔥 Fetch Single Product
  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/products/${id}`
        );

        console.log("Product Details 👉", res.data);

        // agar backend response res.data.product me hai
        setProduct(res.data.product || res.data);
      } catch (error) {
        console.log("Fetch Error 👉", error);
      }
    };

    fetchSingleProduct();
  }, [id]);

  // value clean function
  const cleanValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null"
    ) {
      return "-";
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return String(value).replace(/"/g, "").trim();
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-tabs-container">

      {/* Tabs Header */}
      <div className="ProductTab-tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`ProductTab-tab-btn ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="ProductTab-tab-content">

        {/* ================= DESCRIPTION TAB ================= */}
        {activeTab === "Description" && (
          <div className="ProductTab-fade-in">
            <h2 className="ProductTab-title">Description</h2>

            <div className="ProductTab-details-grid">

              <div className="ProductTab-row">
          
                <span>{cleanValue(product?.description)}</span>
              </div>

              <div className="ProductTab-row">
                <span>Gender</span>
                <span>{cleanValue(product?.gender)}</span>
              </div>

              <div className="ProductTab-row">
                <span>Brand</span>
                <span>{cleanValue(product?.brand)}</span>
              </div>

              <div className="ProductTab-row">
                <span>Category</span>
                <span>{cleanValue(product?.category)}</span>
              </div>

            </div>
          </div>
        )}

        {/* ================= PRODUCT DETAILS TAB ================= */}
        {activeTab === "Product Details" && (
          <div className="ProductTab-fade-in">
            <h2 className="ProductTab-title">Product Details</h2>

            <div className="ProductTab-details-grid">

              {/* Dynamic Specifications */}
              {product?.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(
                  ([key, value]) => (
                    <div className="ProductTab-row" key={key}>
                      <span>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      <span>{cleanValue(value)}</span>
                    </div>
                  )
                )
              ) : (
                <div className="ProductTab-row">
                  <span>Specifications</span>
                  <span>No specifications available</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= DELIVERY DETAILS TAB ================= */}
        {activeTab === "Delivery Details" && (
          <div className="ProductTab-fade-in">
            <h2 className="ProductTab-title">Delivery Details</h2>

            <div className="ProductTab-details-grid">
              <div className="ProductTab-row">
                <span>Delivery Time</span>
                <span>3-5 Working Days</span>
              </div>

              <div className="ProductTab-row">
                <span>Cash on Delivery</span>
                <span>Available</span>
              </div>

              <div className="ProductTab-row">
                <span>Return Policy</span>
                <span>7 Days Easy Return</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= REVIEW TAB ================= */}
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