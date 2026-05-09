import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../../Style-CSS/Landing-css/LandingCom7.css";
import API from "../api/api";

/* ── Skeleton ──────────────────────────────────── */
function CollectionSkeleton() {
  return (
    <div className="collection-slider">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="collection-card skeleton-card" />
      ))}
    </div>
  );
}

const CategoryCollection = () => {
  const navigate = useNavigate();

  const [occasionData, setOccasionData] = useState([]);
  const blockedOccasions = ["wedding", "travel", "office"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  
  const getSingleProductPerOccasion = (products) => {
  const map = {};

  const blockedOccasions = ["wedding", "travel", "office"];

  products.forEach((product) => {
    const mainImage = product?.variants?.[0]?.mainImage;

    product.occasion?.forEach((occ) => {
      if (!occ) return;

      if (blockedOccasions.includes(occ.toLowerCase())) return;

      // ✅ sirf tab set karo jab main image ho
      if (!map[occ] && mainImage) {
        map[occ] = {
          product,
          mainImage,
        };
      }
    });
  });

  return Object.entries(map).map(([occasion, data]) => ({
    title: occasion,
    image: data.mainImage, // 👈 correct image
    occasion,
  }));
};
  /* ── Fetch Products ───────────────── */
  useEffect(() => {
    API.get("/api/products")
      .then((res) => {
        const products = res.data?.products || res.data || [];

        const occData = getSingleProductPerOccasion(products);
        setOccasionData(occData);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="collection-section">

      <div className="collection-header">
        <h2>
          Shop by <em>Occasion</em>
        </h2>
      </div>

      {/* Loading */}
      {loading && <CollectionSkeleton />}

      {/* Error */}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "gray" }}>
          Loading....
        </p>
      )}

      {/* Data */}
      {!loading && !error && (
        <div className="collection-slider">
          {occasionData.map((item, index) => (
            <div
              className="collection-card"
              key={item.title || index}
              onClick={() =>
                navigate(`/products?occasion=${item.occasion}`)
              }
            >
              <div className="card-img">
                <img
                  src={item.image || "/images/default.jpg"}
                  alt={item.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  width="300"
                  height="380"
                />
              </div>

              <div className="card-bottom">
                <span className="category-title">
                  {item.title}
                </span>
                <FaArrowRight className="card-arrow" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CategoryCollection;