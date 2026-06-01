import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style-CSS/ProductPage/SimilarProducts.css";
import API from "../api/api";

const YouMayAlso = ({ currentProduct }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentProduct) fetchSimilarProducts();
  }, [currentProduct]);

  const fetchSimilarProducts = async () => {
    try {
      const res = await API.get("/api/products");
      const allProducts = res.data || [];

      const filtered = allProducts.filter((item) => {
        if (item._id === currentProduct?._id) return false;
        const sameGender = item.gender?.toLowerCase() === currentProduct?.gender?.toLowerCase();
        const sameSubCategory = item.subCategory?.name?.toLowerCase() === currentProduct?.subCategory?.name?.toLowerCase();
        const sameType = item.productType?.name?.toLowerCase() === currentProduct?.productType?.name?.toLowerCase();
        return sameGender && (sameSubCategory || sameType);
      });

      setProducts(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="similar-container">
      <h2 className="similar-title">You May Also Like</h2>

      <div className="similar-grid">
        {products.map((item) => {

          // ✅ Price calculation
          const originalPrice = item.variants?.[0]?.sizes?.[0]?.price || 0;
          const discount      = item.discount || 0;
          const finalPrice    = Math.max(0, originalPrice - discount);
          const discountPct   = originalPrice > 0
            ? Math.round((discount / originalPrice) * 100)
            : 0;

          return (
            <div
              className="similar-product-card"
              key={item._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <div className="img-box">
                <img src={item.variants?.[0]?.mainImage} alt={item.title} />
                <div className="rating-badge">{item.rating || 4.2} ★</div>
              </div>

              <div className="product-info">
                <h4 className="similar-product-brand">{item.specifications?.Brand}</h4>
                <p className="similar-product-title">{item.title}</p>

                <div className="similar-price-row">
                  <span className="similar-product-price">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="similar-product-old-price">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  {discountPct > 0 && ( 
                    <span className="similar-product-discount">
                      ({discountPct}% OFF)
                    </span>
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

export default YouMayAlso;