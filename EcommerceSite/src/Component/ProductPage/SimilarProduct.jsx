import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../Store/Slices/ProductSlice";
import { useParams, useNavigate } from "react-router-dom";
import "../../Style-CSS/ProductPage/SimilarProducts.css";

const SimilarProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { allItems, loading } = useSelector((state) => state.products);

  const currentProduct = allItems.find((item) => item._id === id);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // ── Priority-based Similar Products Logic ──────────────────
  const similarProducts = (() => {
    const results = [];
    const addedIds = new Set([id]);

    const currentGender =
      currentProduct?.gender ||
      currentProduct?.subCategory?.gender?.name;

    const currentProductTypeId = currentProduct?.productType?._id;
    const currentSubCategoryId = currentProduct?.subCategory?._id;

    // Priority 1 — Same productType (e.g. Cargo Pants → Cargo Pants)
    allItems.forEach((item) => {
      if (addedIds.has(item._id)) return;
      if (item.productType?._id === currentProductTypeId) {
        results.push(item);
        addedIds.add(item._id);
      }
    });

    // Priority 2 — Same subCategory + same gender (e.g. Western Wear + Men)
    if (results.length < 8) {
      allItems.forEach((item) => {
        if (addedIds.has(item._id)) return;
        const itemGender =
          item.gender || item.subCategory?.gender?.name;
        if (
          item.subCategory?._id === currentSubCategoryId &&
          itemGender === currentGender
        ) {
          results.push(item);
          addedIds.add(item._id);
        }
      });
    }

    // Priority 3 — Same gender only (e.g. Men ka koi bhi product)
    if (results.length < 8) {
      allItems.forEach((item) => {
        if (addedIds.has(item._id)) return;
        const itemGender =
          item.gender || item.subCategory?.gender?.name;
        if (itemGender === currentGender) {
          results.push(item);
          addedIds.add(item._id);
        }
      });
    }

    return results.slice(0, 8);
  })();

  if (loading) return <h2>Loading...</h2>;
  if (!similarProducts.length) return null;

  return (
    <div className="similar-container">
      <h2 className="similar-title">Similar Products</h2>

      <div className="similar-grid">
        {similarProducts.map((item) => {

          // ── Image ──
          const firstVariant = item.variants?.[0];
          const firstImage =
            firstVariant?.mainImage ||
            firstVariant?.images?.[0] ||
            "";

          // ── Price Calculation ──
          const allPrices =
            item.variants?.flatMap(
              (v) => v.sizes?.map((s) => Number(s.price)) || []
            ) || [];

          const originalPrice =
            allPrices.length > 0
              ? Math.min(...allPrices)
              : Number(item.price || 0);

          const discountValue = Number(item.discount || 0);

          const discountPercent =
            originalPrice > 0 && discountValue > 0
              ? Math.round((discountValue / originalPrice) * 100)
              : 0;

          const finalPrice = Math.max(0, originalPrice - discountValue);

          // ── Brand ──
          const brand =
            item.specifications?.Brand?.replace(/"/g, "").trim() ||
            item.brand ||
            "Kelwor";

          return (
            <div
              className="similar-product-card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* Image */}
              <div className="img-box">
                <img src={firstImage} alt={item.title} />
                <div className="rating-badge">
                  {item.rating || 4.3} ★
                </div>
              </div>

              {/* Info */}
              <div className="product-info">
                <h4 className="similar-product-brand">{brand}</h4>

                <p className="similar-product-title">{item.title}</p>

                <div className="similar-price-row">
                  <span className="similar-product-price">
                    ₹{Number(finalPrice).toLocaleString("en-IN")}
                  </span>

                  {discountPercent > 0 && (
                    <>
                      <span className="similar-product-old-price">
                        ₹{Number(originalPrice).toLocaleString("en-IN")}
                      </span>
                      <span className="similar-product-discount">
                        ({discountPercent}% OFF)
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

export default SimilarProducts;