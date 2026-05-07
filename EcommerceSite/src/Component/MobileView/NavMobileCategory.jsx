import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../Style-CSS/MobileView/NavMobileCategory.css";

const MobileCategoryView = ({ categoryName, genderId, onBack }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (!genderId) return;
    setLoading(true);
    // gender._id se subcategories fetch karo
    fetch(`http://localhost:4000/api/subcategory/gender/${genderId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubCategories(data.subCategories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("SubCategory fetch error:", err);
        setLoading(false);
      });
  }, [genderId]);

  const handleSubCategoryClick = (sub) => {
    navigate(`/products?gender=${genderId}&subcategory=${sub._id}`);
    onBack();
  };

  return (
    <div className="mobile-cat-view">
      {/* Header */}
      <div className="mobile-cat-header">
        <button className="mobile-cat-back" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2 className="mobile-cat-title">{categoryName}</h2>
        <button className="mobile-cat-cart">
          <CiShoppingCart className="mobile-cat-cart-icon" />
          {totalQty > 0 && <span className="mobile-cat-cart-badge">{totalQty}</span>}
        </button>
      </div>

      {/* Subcategory List */}
      <div className="mobile-cat-list">
        {loading ? (
          <div className="mobile-cat-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mobile-cat-skeleton">
                <div className="skeleton-text" />
                <div className="skeleton-img" />
              </div>
            ))}
          </div>
        ) : subCategories.length === 0 ? (
          <p className="mobile-cat-empty">No subcategories found.</p>
        ) : (
          subCategories.map((sub, index) => (
            <div
              key={sub._id || index}
              className="mobile-cat-item"
              onClick={() => handleSubCategoryClick(sub)}
            >
              <span className="mobile-cat-item-name">{sub.name}</span>
              {sub.image ? (
                <img
                  className="mobile-cat-item-img"
                  src={sub.image}
                  alt={sub.name}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="mobile-cat-item-img-placeholder" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileCategoryView;