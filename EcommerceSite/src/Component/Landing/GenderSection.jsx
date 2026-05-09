import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        {/* ✅ already lazy tha, decoding="async" add kiya */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          width="300"
          height="350"
        />
        <div className="gsub-img-overlay" />
      </div>
      <span className="gsub-label">{item.name}</span>
    </div>
  );
}

/* ── Gender Tab ───────────────────────────────────── */
function GenderSection({ title, tag, subCategories, loading }) {
  // ✅ Data upar se props mein aata hai — apni API call nahi karega
  return (
    <div className="gsub-section">
      <div className="gsub-section-header">
        <div className="gsub-section-title-wrap">
          <span className="gsub-tag">{tag}</span>
          <h2 className="gsub-section-title">{title}</h2>
        </div>
        <button className="gsub-view-all">
          View All <span>→</span>
        </button>
      </div>

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
  const [genders, setGenders] = useState({
    men: menGenderId || null,
    women: womenGenderId || null,
  });

  const [menSubs, setMenSubs] = useState([]);
  const [womenSubs, setWomenSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 1 — gender IDs nahi hain toh fetch karo
  useEffect(() => {
    if (menGenderId && womenGenderId) return;

    API.get("/api/gender")
      .then((res) => {
        const list = res.data.genders || res.data;
        const men = list.find((g) => g.name?.toLowerCase() === "men");
        const women = list.find((g) => g.name?.toLowerCase() === "women");
        setGenders({ men: men?._id, women: women?._id });
      })
      .catch((err) => console.error("Gender fetch error:", err));
  }, [menGenderId, womenGenderId]);

  // Step 2 — dono subcategories ek saath fetch karo (parallel)
  useEffect(() => {
    if (!genders.men || !genders.women) return;

    setLoading(true);

    // ✅ Promise.all — dono calls parallel, ek ka wait nahi doosre ko
    Promise.all([
      API.get(`/api/subcategory/gender/${genders.men}`),
      API.get(`/api/subcategory/gender/${genders.women}`),
    ])
      .then(([menRes, womenRes]) => {
        setMenSubs(menRes.data.subCategories || []);
        setWomenSubs(womenRes.data.subCategories || []);
      })
      .catch((err) => console.error("SubCategory fetch error:", err))
      .finally(() => setLoading(false));
  }, [genders.men, genders.women]);

  return (
    <div className="gsub-page">
      <div className="gsub-page-header">
        <p className="gsub-page-eyebrow">Explore Collections</p>
        <h1 className="gsub-page-title">
          Shop by <em>Style</em>
        </h1>
        <p className="gsub-page-sub">
          Curated categories across men's & women's fashion
        </p>
      </div>

      <div className="gsub-divider" />

      <GenderSection
        title="Men's Collection"
        tag="HIM"
        subCategories={menSubs}
        loading={loading}
      />

      <div className="gsub-section-gap" />

      <GenderSection
        title="Women's Collection"
        tag="HER"
        subCategories={womenSubs}
        loading={loading}
      />
    </div>
  );
}