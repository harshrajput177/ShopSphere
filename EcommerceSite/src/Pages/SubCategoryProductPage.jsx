import "../Style-CSS/Pages/SubCategoryProduct.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Component/api/api";

import { GiTShirt, GiTrousers, GiSleevelessJacket, GiUnderwear, GiDress, GiClothes } from "react-icons/gi";
import { PiCoatHangerFill } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";

/* ── Group Icons (react-icons) ───────────────────── */
const GROUP_ICONS = {
  Topwear:      <GiTShirt size={20} />,
  Bottomwear:   <GiTrousers size={20} />,
  Innerwear:    <GiUnderwear size={20} />,
  "Co-ord Set": <PiCoatHangerFill size={20} />,
  OnePiece:     <GiDress size={20} />,
  Outerwear:    <GiSleevelessJacket size={20} />,
  Other:        <MdOutlineCategory size={20} />,
};

const GROUP_ORDER = ["Topwear", "Bottomwear", "Outerwear", "Co-ord Set", "OnePiece", "Innerwear", "Other"];

/* ── ProductType Card ────────────────────────────── */
function ProductTypeCard({ item, index }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="spp-card"
      style={{ "--i": index }}
     onClick={() => item.slug && navigate(`/products/${item.slug}`)}
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
          <span className="spp-explore-label">View All</span>
        </div>
      </div>
      <div className="spp-card-info">
        <h3 className="spp-card-name">{item.name}</h3>
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
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`spp-group-section${visible ? " spp-visible" : ""}`}
    >
      <div className="spp-group-header">
        <div className="spp-group-icon-wrap">
          {GROUP_ICONS[group] || GROUP_ICONS["Other"]}
        </div>
        <div className="spp-group-text">
          <h2 className="spp-group-title">{group}</h2>
          <span className="spp-group-count">{items.length} styles</span>
        </div>
      </div>

      <div className="spp-cards-grid">
        {items.map((item, i) => (
          <ProductTypeCard key={item._id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Skeleton ────────────────────────────────────── */
function SkeletonLoader() {
  return (
    <div className="spp-skeleton-wrap">
      <div className="spp-skeleton-header" />
      <div className="spp-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="spp-skeleton-card">
            <div className="spp-skeleton-img" />
            <div className="spp-skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sticky Group Pills Nav ──────────────────────── */
function GroupPillNav({ groups, onSelect }) {
  const [active, setActive] = useState(null);
  const scrollRef = useRef(null);

  const handleSelect = (g) => {
    setActive(g);
    onSelect(g);
    const btn = scrollRef.current?.querySelector(`[data-group="${g}"]`);
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="spp-pill-nav-wrap">
      <div className="spp-pill-nav" ref={scrollRef}>
        {groups.map((g) => (
          <button
            key={g}
            data-group={g}
            className={`spp-pill${active === g ? " active" : ""}`}
            onClick={() => handleSelect(g)}
          >
            <span className="spp-pill-icon">{GROUP_ICONS[g] || GROUP_ICONS["Other"]}</span>
            <span>{g}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────── */
export default function SubCategoryProductPage() {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();

  const [productTypes, setProductTypes] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const heroRef = useRef(null);
  const [heroShrunk, setHeroShrunk] = useState(false);

  useEffect(() => {
    if (!subCategoryId) return;
    setLoading(true);

    Promise.all([
      API.get(`/api/product-type/subcategory/${subCategoryId}`),
      API.get(`/api/subcategory/${subCategoryId}`).catch(() => ({ data: null })),
    ])
      .then(([ptRes, subRes]) => {
        setProductTypes(ptRes.data.productTypes || ptRes.data || []);
        setSubCategory(subRes.data?.subCategory || subRes.data);
      })
      .catch(() => setError("Something went wrong, please try again."))
      .finally(() => setLoading(false));
  }, [subCategoryId]);

  useEffect(() => {
    const onScroll = () => setHeroShrunk(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const grouped = productTypes.reduce((acc, pt) => {
    const g = pt.group || "Other";
    if (!acc[g]) acc[g] = [];
    acc[g].push(pt);
    return acc;
  }, {});

  const availableGroups = GROUP_ORDER.filter((g) => grouped[g]);

  const scrollToGroup = (group) => {
    const el = document.getElementById(`grp-${group}`);
    if (el) {
      const offset = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="spp-root">

      {/* ── Hero ── */}
      <div className={`spp-hero${heroShrunk ? " shrunk" : ""}`} ref={heroRef}>
        {subCategory?.image && (
          <img
            src={subCategory.image}
            alt={subCategory?.name}
            className="spp-hero-img"
          />
        )}
        <div className="spp-hero-overlay" />
        <div className="spp-hero-content">
          <div className="spp-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span className="spp-bc-dot">·</span>
            <span>{subCategory?.gender?.name || ""}</span>
            <span className="spp-bc-dot">·</span>
            <span className="spp-bc-current">{subCategory?.name || "Collection"}</span>
          </div>
          <div className="spp-hero-bottom">
            <p className="spp-hero-eyebrow">Browse Collection</p>
            <h1 className="spp-hero-title">{subCategory?.name || "Collection"}</h1>
            <p className="spp-hero-caption">
              {productTypes.length} styles crafted for{" "}
              <em>{subCategory?.gender?.name?.toLowerCase() || "you"}</em>
            </p>
            <div className="spp-hero-stats">
              <div className="spp-stat">
                <b>{productTypes.length}+</b>
                <span>Styles</span>
              </div>
              <div className="spp-stat-sep" />
              <div className="spp-stat">
                <b>New</b>
                <span>Arrivals</span>
              </div>
              <div className="spp-stat-sep" />
              <div className="spp-stat">
                <b>Free</b>
                <span>Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Group Pills ── */}
      {!loading && availableGroups.length > 0 && (
        <GroupPillNav groups={availableGroups} onSelect={scrollToGroup} />
      )}

      {/* ── Content ── */}
      <div className="spp-body">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="spp-state-box">
            <span className="spp-state-emoji">😕</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : productTypes.length === 0 ? (
          <div className="spp-state-box">
            <span className="spp-state-emoji">🛍️</span>
            <h3>Nothing here yet</h3>
            <p>New styles coming soon</p>
          </div>
        ) : (
          availableGroups.map((group) => (
            <div key={group} id={`grp-${group}`}>
              <GroupSection group={group} items={grouped[group]} />
            </div>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      {!loading && (
        <div className="spp-footer">
          <button className="spp-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span>Free delivery above ₹499 · 30-day returns</span>
        </div>
      )}
    </div>
  );
}