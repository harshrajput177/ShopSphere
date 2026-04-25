import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../Store/Slices/ProductSlice";
import { useParams, useNavigate } from "react-router-dom";
import "../../Style-CSS/ProductPage/SimilarProducts.css";

const SimilarProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { allItems, loading } = useSelector(
    (state) => state.products
  );

  // 🔥 current product
  const currentProduct = allItems.find(
    (item) => item._id === id
  );

  // 🔥 fetch all products once
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // 🔥 similar products logic
  const similarProducts = allItems
    .filter((item) => {
      // current product remove
      if (item._id === id) return false;

      // same category OR same subcategory OR same productType
      return (
        item.category?._id === currentProduct?.category?._id ||
        item.subCategory?._id === currentProduct?.subCategory?._id ||
        item.productType?._id === currentProduct?.productType?._id
      );
    })
    .slice(0, 8);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!similarProducts.length) {
    return null;
  }

  return (
    <div className="similar-container">
      <h2 className="similar-title">
        Similar Products
      </h2>

      <div className="similar-grid">
        {similarProducts.map((item) => {
       const firstVariant = item.variants?.[0];

const firstImage =
  firstVariant?.mainImage ||
  firstVariant?.images?.[0] ||
  "";

const allPrices =
  item.variants?.flatMap(
    (v) =>
      v.sizes?.map((s) => Number(s.price)) || []
  ) || [];

const originalPrice =
  allPrices.length > 0
    ? Math.min(...allPrices)
    : Number(item.price || 0);

const discountValue =
  Number(item.discount || 0);

const discountPercent = originalPrice
  ? Math.round(
      (discountValue / originalPrice) * 100
    )
  : 0;

const finalPrice = Math.max(
  0,
  originalPrice - discountValue
);

const oldPrice = originalPrice;

          return (
            <div
              className="similar-product-card"
              key={item._id}
              onClick={() =>
                navigate(`/product/${item._id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <div className="img-box">
                <img
                  src={firstImage}
                  alt={item.title}
                />

                <div className="rating-badge">
                  4.3 ★
                </div>
              </div>

              <div className="product-info">
                <h4 className="similar-product-brand">
                  {item.brand || "Premium"}
                </h4>

                <p className="similar-product-title">
                  {item.title}
                </p>

                <div className="price-row">
                  <span className="similar-product-price">
                    Rs. {finalPrice}
                  </span>

                  <span className="similar-product-old-price">
                    Rs. {oldPrice}
                  </span>

               <span className="similar-product-discount">
  ({discountPercent}% OFF)
</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarProducts;