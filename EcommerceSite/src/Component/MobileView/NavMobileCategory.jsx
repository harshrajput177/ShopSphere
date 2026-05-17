import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { useSelector } from "react-redux";
import "../../Style-CSS/MobileView/NavMobileCategory.css";

const MobileCategoryView = ({ categoryName, genderId, onBack }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

const navigate = useNavigate();

  useEffect(() => {
    if (!genderId) return;

    setLoading(true);

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

  // ================= PRODUCT TYPE FETCH =================

  const handleSubCategoryClick = async (sub) => {
    setSelectedSubCategory(sub);
    setProductLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/product-type/subcategory/${sub._id}`
      );

      const data = await res.json();

      setProductTypes(data.productTypes || []);
    } catch (err) {
      console.error("Product Type fetch error:", err);
    } finally {
      setProductLoading(false);
    }
  };


  const handleBackInside = () => {
    setSelectedSubCategory(null);
    setProductTypes([]);
  };

  const handleProductTypeClick = (item) => {
  navigate(`/products/${item.slug}`);
  onBack();
};

  return (
    <div className="mobile-cat-view">
      {/* HEADER */}
      <div className="mobile-cat-header">
        <button
          className="mobile-cat-back"
          onClick={selectedSubCategory ? handleBackInside : onBack}
        >
          <FaArrowLeft />
        </button>

        <h2 className="mobile-cat-title">
          {selectedSubCategory
            ? selectedSubCategory.name
            : categoryName}
        </h2>

        <button className="mobile-cat-cart">
          <CiShoppingCart className="mobile-cat-cart-icon" />

          {totalQty > 0 && (
            <span className="mobile-cat-cart-badge">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {/* BODY */}

      <div className="mobile-cat-list">

        {!selectedSubCategory && (
          <>
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
              <p className="mobile-cat-empty">
                No subcategories found.
              </p>
            ) : (
              subCategories.map((sub, index) => (
                <div
                  key={sub._id || index}
                  className="mobile-cat-item"
                  onClick={() => handleSubCategoryClick(sub)}
                >
                  <span className="mobile-cat-item-name">
                    {sub.name}
                  </span>

                  {sub.image ? (
                    <img
                      className="mobile-cat-item-img"
                      src={sub.image}
                      alt={sub.name}
                    />
                  ) : (
                    <div className="mobile-cat-item-img-placeholder" />
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* PRODUCT TYPE VIEW */}

        {selectedSubCategory && (
          <>
            {productLoading ? (
              <div className="mobile-cat-loading">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="mobile-cat-skeleton">
                    <div className="skeleton-text" />
                    <div className="skeleton-img" />
                  </div>
                ))}
              </div>
            ) : productTypes.length === 0 ? (
              <p className="mobile-cat-empty">
                No product types found.
              </p>
            ) : (
              productTypes.map((item, index) => (
             <div
  key={item._id || index}
  className="mobile-cat-item"
  onClick={() => handleProductTypeClick(item)}
>
                  <span className="mobile-cat-item-name">
                    {item.name}
                  </span>

                  {item.image ? (
                    <img
                      className="mobile-cat-item-img"
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className="mobile-cat-item-img-placeholder" />
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileCategoryView;