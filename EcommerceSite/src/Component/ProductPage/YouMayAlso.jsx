import React, { useEffect, useState } from "react";
import "../../Style-CSS/ProductPage/SimilarProducts.css";
import API from "../api/api";

const YouMayAlso = ({ currentProduct }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSimilarProducts();
  }, [currentProduct]);

  const fetchSimilarProducts = async () => {
    try {

      const res = await API.get("/api/products");
const allProducts = res.data || [];
      console.log(currentProduct);
console.log(allProducts);

 const filtered = allProducts.filter((item) => {

  // current product remove
  if (item._id === currentProduct?._id) {
    return false;
  }

  // same gender
  const sameGender =
    item.gender?.toLowerCase() ===
    currentProduct?.gender?.toLowerCase();

  // same subcategory
  const sameSubCategory =
    item.subCategory?.name?.toLowerCase() ===
    currentProduct?.subCategory?.name?.toLowerCase();

  // same product type
  const sameType =
    item.productType?.name?.toLowerCase() ===
    currentProduct?.productType?.name?.toLowerCase();

  return sameGender &&
    (sameSubCategory || sameType);

});

      setProducts(filtered);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="similar-container">

      <h2 className="similar-title">
        You May Also Like
      </h2>

      <div className="similar-grid">

        {products.map((item) => (

          <div
            className="similar-product-card"
            key={item._id}
          >

            <div className="img-box">

              <img
                src={
                  item.variants?.[0]?.mainImage
                }
                alt={item.title}
              />

              <div className="rating-badge">
                4.2 ★
              </div>

            </div>

            <div className="product-info">

              <h4 className="similar-product-brand">
                {item.specifications?.Brand}
              </h4>

              <p className="similar-product-title">
                {item.title}
              </p>

              <div className="similar-price-row">

                <span className="similar-product-price">
                  Rs.
                  {
                    item.variants?.[0]?.sizes?.[0]
                      ?.salePrice
                  }
                </span>

                <span className="similar-product-old-price">
                  Rs.
                  {
                    item.variants?.[0]?.sizes?.[0]
                      ?.price
                  }
                </span>

                <span className="similar-product-discount">
                  ({item.discount} OFF)
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default YouMayAlso;