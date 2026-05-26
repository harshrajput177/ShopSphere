import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Component/api/api";
import "../Style-CSS/Pages/SubCategoryProduct.css";

/* ── Group Icon Map ──────────────────────────────── */
const GROUP_ICONS = {
  Topwear: "👕",
  Bottomwear: "👖",
  Innerwear: "🩱",
  "Co-ord Set": "👗",
  OnePiece: "👘",
  Outerwear: "🧥",
  Other: "✨",
};

const GROUP_ORDER = [
  "Topwear",
  "Bottomwear",
  "Outerwear",
  "Co-ord Set",
  "OnePiece",
  "Innerwear",
  "Other",
];

/* ── ProductType Card ────────────────────────────── */
function ProductTypeCard({ item, index }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="spp-card"
      style={{ "--i": index }}
      onClick={() => item.slug && navigate(`/products/type/${item.slug}`)}
    >
      <div className="spp-card-img-wrap">
        {!imgLoaded && <div className="spp-img-shimmer" />}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={imgLoaded ? "loaded" : ""}
        />
        <div className="spp-card-overlay">
          <span className="spp-explore-btn">Explore →</span>
        </div>
        {item.isNew && <span className="spp-badge">NEW</span>}
      </div>
      <div className="spp-card-info">
        <h3 className="spp-card-name">{item.name}</h3>
        <p className="spp-card-group">{item.group}</p>
      </div>
    </div>
  );
}

/* ── Group Section ───────────────────────────────── */
function GroupSection({ group, items }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`spp-group-section ${visible ? "spp-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="spp-group-header">
        <div className="spp-group-title-wrap">
          <span className="spp-group-icon">{GROUP_ICONS[group] || "✨"}</span>
          <h2 className="spp-group-title">{group}</h2>
          <span className="spp-group-count">{items.length} styles</span>
        </div>
        <div className="spp-group-line" />
      </div>
      <div className="spp-cards-grid">
        {items.map((item, i) => (
          <ProductTypeCard key={item._id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Skeleton Loader ─────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="spp-skeleton-wrap">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="spp-skeleton-card">
          <div className="spp-skeleton-img" />
          <div className="spp-skeleton-line" />
          <div className="spp-skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

/* ── Hero Banner ─────────────────────────────────── */
function HeroBanner({ subCategoryName, genderName, totalCount, heroImage }) {
  return (
    <div className="spp-hero">
      <div className="spp-hero-bg">
        {heroImage && (
          <img src={heroImage} alt="" className="spp-hero-bg-img" />
        )}
        <div className="spp-hero-gradient" />
        <div className="spp-hero-noise" />
      </div>
      <div className="spp-hero-content">
        <div className="spp-hero-breadcrumb">
          <span>Home</span>
          <span className="spp-bc-sep">/</span>
          <span>{genderName}</span>
          <span className="spp-bc-sep">/</span>
          <span className="spp-bc-active">{subCategoryName}</span>
        </div>
        <div className="spp-hero-text">
          <p className="spp-hero-eyebrow">Browse Collection</p>
          <h1 className="spp-hero-title">{subCategoryName}</h1>
          <p className="spp-hero-sub">
            {totalCount} styles crafted for{" "}
            <em>{genderName?.toLowerCase()}</em>
          </p>
        </div>
        <div className="spp-hero-stats">
          <div className="spp-stat">
            <span className="spp-stat-num">{totalCount}+</span>
            <span className="spp-stat-label">Styles</span>
          </div>
          <div className="spp-stat-divider" />
          <div className="spp-stat">
            <span className="spp-stat-num">New</span>
            <span className="spp-stat-label">Arrivals</span>
          </div>
          <div className="spp-stat-divider" />
          <div className="spp-stat">
            <span className="spp-stat-num">Free</span>
            <span className="spp-stat-label">Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sticky Nav ──────────────────────────────────── */
function StickyGroupNav({ groups, activeGroup, onSelect }) {
  return (
    <nav className="spp-sticky-nav">
      <div className="spp-sticky-nav-inner">
        {groups.map((g) => (
          <button
            key={g}
            className={`spp-nav-pill ${activeGroup === g ? "active" : ""}`}
            onClick={() => onSelect(g)}
          >
            <span>{GROUP_ICONS[g] || "✨"}</span> {g}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ── Main Page ───────────────────────────────────── */
export default function SubCategoryProductPage() {
  const { subCategoryId } = useParams(); // route: /subcategory/:subCategoryId
  const navigate = useNavigate();

  const [productTypes, setProductTypes] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!subCategoryId) return;
    setLoading(true);

    Promise.all([
      API.get(`/api/product-type/subcategory/${subCategoryId}`),
      API.get(`/api/subcategory/${subCategoryId}`).catch(() => ({ data: null })),
    ])
      .then(([ptRes, subRes]) => {
        const types = ptRes.data.productTypes || ptRes.data || [];
        setProductTypes(types);
        setSubCategory(subRes.data?.subCategory || subRes.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [subCategoryId]);

  // Group by "group" field
  const grouped = productTypes
    .filter((pt) =>
      pt.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reduce((acc, pt) => {
      const g = pt.group || "Other";
      if (!acc[g]) acc[g] = [];
      acc[g].push(pt);
      return acc;
    }, {});

  const availableGroups = GROUP_ORDER.filter((g) => grouped[g]);

  const scrollToGroup = (group) => {
    setActiveGroup(group);
    document.getElementById(`group-${group}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="spp-root">
      {/* Hero */}
      <HeroBanner
        subCategoryName={subCategory?.name || "Collection"}
        genderName={subCategory?.gender?.name || ""}
        totalCount={productTypes.length}
        heroImage={subCategory?.image}
      />

      {/* Sticky Group Nav */}
      {!loading && availableGroups.length > 0 && (
        <StickyGroupNav
          groups={availableGroups}
          activeGroup={activeGroup}
          onSelect={scrollToGroup}
        />
      )}

      {/* Search Bar */}
      {!loading && (
        <div className="spp-search-wrap">
          <div className="spp-search-box">
            <span className="spp-search-icon">🔍</span>
            <input
              type="text"
              placeholder={`Search in ${subCategory?.name || "collection"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="spp-search-input"
            />
            {searchQuery && (
              <button
                className="spp-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="spp-content">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="spp-error">
            <span>😕</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : productTypes.length === 0 ? (
          <div className="spp-empty">
            <span>🛍️</span>
            <h3>No styles here yet</h3>
            <p>Check back soon for new arrivals</p>
          </div>
        ) : (
          <>
            {availableGroups.map((group) => (
              <div key={group} id={`group-${group}`}>
                <GroupSection group={group} items={grouped[group]} />
              </div>
            ))}

            {searchQuery && Object.keys(grouped).length === 0 && (
              <div className="spp-no-results">
                <span>🔎</span>
                <p>No results for "<strong>{searchQuery}</strong>"</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer strip */}
      <div className="spp-footer-strip">
        <button className="spp-back-btn" onClick={() => navigate(-1)}>
          ← Back to Collections
        </button>
        <p>Free delivery on orders above ₹499 · Easy 30-day returns</p>
      </div>
    </div>
  );
}