import { useMemo } from "react";
import "../../Style-CSS/Landing-css/LandingCom2.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ── Card ───────────────────────────────────── */
function CategoryCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!item.slug) {
      console.error("Slug missing for:", item.name);
      return;
    }
    navigate(`/products/${item.slug}`);
  };

  return (
    <div
      className="category-card-com2"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-img-wrap-com2">
        <img
          src={
            item.image?.startsWith("http")
              ? item.image
              : `${import.meta.env.VITE_API_BASE_URL}/${item.image}`
          }
          alt={item.name}
          loading="lazy"
          decoding="async"
          width="400"
          height="500"
          onError={(e) => {
            e.target.src = "/images/default.jpg";
          }}
        />
      </div>

      <span className="card-label">{item.name}</span>
    </div>
  );
}

/* ── Main Component ─────────────────────────── */
export default function CategoryGrid() {
  const { data } = useSelector((state) => state.productType);

  // 🔥 shuffle + limit (memoized for performance)
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];

    const limited = data.slice(0, 26);
    return [...limited].sort(() => Math.random() - 0.5);
  }, [data]);

  const firstRow = categories.slice(0, 14);
  const secondRow = categories.slice(14);

  return (
    <section className="category-section">
      <div className="section-header">
        <h2 className="section-title">
          Shop by <span>Category</span>
        </h2>
      </div>

      <div className="row-wrapper">

        {/* FIRST ROW */}
        <div className="categories-row-com2">
          {firstRow.map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="categories-row-com2">
          {secondRow.map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}