import React, { useEffect, useState } from "react";
import "../../Style-CSS/ProductPage/SimilarProducts.css";

const RecentViewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentViewed")) || [];
    setProducts(recent);
  }, []);

  return (
    <div className="similar-container">
      <h2 className="similar-title">Recently Viewed</h2>

      <div className="similar-grid">
        {products.map((item) => {
          const basePrice = item.variants?.[0]?.sizes?.[0]?.price || 0;
          const discount = item.discount || 0;
          const oldPrice = basePrice + discount;
          const brand = item.specifications?.Brand?.replace(/"/g, "") || "Kelwor";

          return (
            <div className="similar-product-card" key={item._id}>

              <div className="img-box">
                <img
                  src={item.variants?.[0]?.mainImage}
                  alt={item.title}
                />
                <div className="rating-badge">
                  {item.rating || 4.2} ★
                </div>
              </div>

              <div className="product-info">
                <h4 className="similar-product-brand">
                  {brand}
                </h4>

                <p className="similar-product-title">
                  {item.title}
                </p>

              <div className="similar-price-row">
  <span className="similar-product-price">
    Rs. {basePrice}
  </span>

  {discount > 0 && (
    <>
      <span className="similar-product-old-price">
        Rs. {oldPrice}
      </span>

      <span className="similar-product-discount">
        (Rs. {discount} off)
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