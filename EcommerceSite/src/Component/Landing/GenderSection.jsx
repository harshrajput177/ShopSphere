import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Style-CSS/Landing-css/GenderSection.css";
import API from "../api/api";

/* ── Single Card ──────────────────────────────────── */
function SubCategoryCard({ item, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!item.slug) return;
    navigate(`/products/${item.slug}`);
  };

  return (
    <div
      className="gsub-card"
      onClick={handleClick}
      style={{ animationDelay: `${0.04 + index * 0.05}s` }}
    >
      <div className="gsub-img-wrap">
        <img src={item.image} alt={item.name} loading="lazy" />
        <div className="gsub-img-overlay" />
      </div>
      <span className="gsub-label">{item.name}</span>
    </div>
  );
}

/* ── Gender Tab ───────────────────────────────────── */
function GenderSection({ title, tag, genderId }) {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!genderId) return;
    setLoading(true);
   API.get(`/api/subcategory/gender/${genderId}`)
  .then((res) => {
    setSubCategories(res.data.subCategories || []);
    setLoading(false);
  })
  .catch((err) => {
    console.error("SubCategory fetch error:", err);
    setLoading(false);
  });
  }, [genderId]);

  return (
    <div className="gsub-section">
      {/* Section Header */}
      <div className="gsub-section-header">
        <div className="gsub-section-title-wrap">
          <span className="gsub-tag">{tag}</span>
          <h2 className="gsub-section-title">{title}</h2>
        </div>
        <button className="gsub-view-all">
          View All <span>→</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="gsub-skeleton-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gsub-skeleton" />
          ))}
        </div>
      ) : (
        <div className="gsub-grid">
          {subCategories.map((item, i) => (
            <SubCategoryCard key={item._id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────── */
export default function GenderSubCategoryPage({ menGenderId, womenGenderId }) {
  // If you pass genderIds via props — else fetch genders first
  const [genders, setGenders] = useState({ men: menGenderId, women: womenGenderId });

  useEffect(() => {
    // Only fetch if not passed as props
    if (menGenderId && womenGenderId) return;
  API.get("/api/gender")
  .then((res) => {
    const data = res.data;
    const list = data.genders || data;

    const men = list.find((g) => g.name?.toLowerCase() === "men");
    const women = list.find((g) => g.name?.toLowerCase() === "women");

    setGenders({ men: men?._id, women: women?._id });
  })
  .catch((err) => console.error("Gender fetch error:", err));
  }, [menGenderId, womenGenderId]);

  return (
    <div className="gsub-page">
      {/* Page Header */}
      <div className="gsub-page-header">
        <p className="gsub-page-eyebrow">Explore Collections</p>
        <h1 className="gsub-page-title">
          Shop by <em>Style</em>
        </h1>
        <p className="gsub-page-sub">
          Curated categories across men's & women's fashion
        </p>
      </div>

      {/* Divider */}
      <div className="gsub-divider" />

      {/* Men Section */}
      <GenderSection
        title="Men's Collection"
        tag="HIM"
        genderId={genders.men}
      />

      <div className="gsub-section-gap" />

      {/* Women Section */}
      <GenderSection
        title="Women's Collection"
        tag="HER"
        genderId={genders.women}
      />
    </div>
  );
}