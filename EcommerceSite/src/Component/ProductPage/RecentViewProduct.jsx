import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style-CSS/ProductPage/SimilarProducts.css";

const RecentViewProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentViewed")) || [];
    setProducts(recent);
  }, []);

  return (
    <div className="similar-container">
      <h2 className="similar-title">Recently Viewed</h2>

      <div className="similar-grid">
        {products.map((item) => {

          // ✅ Price calculation
          const originalPrice = item.variants?.[0]?.sizes?.[0]?.price || 0;
          const discount      = item.discount || 0;
          const finalPrice    = Math.max(0, originalPrice - discount);
          const discountPct   = originalPrice > 0
            ? Math.round((discount / originalPrice) * 100)
            : 0;
          const brand = item.specifications?.Brand?.replace(/"/g, "") || "Kelwor";

          return (
            <div
              className="similar-product-card"
              key={item._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${item._id}`)} // ✅ Click
            >
              <div className="img-box">
                <img src={item.variants?.[0]?.mainImage} alt={item.title} />
                <div className="rating-badge">{item.rating || 4.2} ★</div>
              </div>

              <div className="product-info">
                <h4 className="similar-product-brand">{brand}</h4>
                <p className="similar-product-title">{item.title}</p>

                <div className="similar-price-row">
                  <span className="similar-product-price">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                  {discountPct > 0 && (
                    <>
                      <span className="similar-product-old-price">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="similar-product-discount">
                        ({discountPct}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentViewProducts;