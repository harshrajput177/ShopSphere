import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductTypes } from "../Store/Slices/ProductType";
import { fetchAllProducts } from "../Store/Slices/ProductSlice";
import API from "../api/api";
import "../../Style-CSS/Landing-css/LandingCom9.css";

const PRICE_BUCKETS = [
  { label: "Under ₹499", maxPrice: 499 },
  { label: "Under ₹599", maxPrice: 599 },
  { label: "Under ₹699", maxPrice: 699 },
  { label: "Under ₹999", maxPrice: 999 },
  { label: "Under ₹1299", maxPrice: 1299 },
  { label: "Under ₹1499", maxPrice: 1499 },
];

const EXCLUDED_GROUPS = ["other", "onepiece", "one piece", "one-piece"];

const OCCASION_CONFIG = [
  { occasion: "Casual", label: "Casual Wear", price: "Under ₹499", maxPrice: 499 },
  { occasion: "Party",  label: "Party Wear",  price: "Under ₹599", maxPrice: 599 },
];

/* ── Skeleton Cards ──────────────────────────────── */
function SkeletonSlider() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="genz-skeleton-card" key={i}>
          <div className="genz-skeleton-img" />
          <div className="genz-skeleton-text" />
          <div className="genz-skeleton-price" />
        </div>
      ))}
    </>
  );
}

/* ── Single Card ─────────────────────────────────── */
function ClearanceCard({ image, label, price, ribbon, onClick }) {
  return (
    <div className="genz-card" onClick={onClick}>
      <div className="genz-card-img-wrap">
        <img
          src={image}
          alt={label}
          onError={e => (e.target.src = "/placeholder.png")}
        />
        {ribbon && <span className="genz-ribbon">{ribbon}</span>}
      </div>
      <div className="genz-card-bottom">
        <div className="genz-info">{label}</div>
        <div className="genz-price">
          <span className="genz-price-dot" />
          {price}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────── */
const Clearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: productTypes, loading: ptLoading }   = useSelector(s => s.productType);
  const { allItems: allProducts, loading: prodLoading } = useSelector(s => s.products);

  const [groupedData,      setGroupedData]      = useState([]);
  const [occasionCards,    setOccasionCards]    = useState([]);
  const [summerCollection, setSummerCollection] = useState(null);

  useEffect(() => {
    if (!productTypes.length)  dispatch(fetchProductTypes());
    if (!allProducts.length)   dispatch(fetchAllProducts());

    API.get("/api/collection")
      .then(res => {
        const collections = res.data?.collections || res.data || [];
        const summer = collections.find(c => c.name.toLowerCase().includes("summer"));
        if (summer) setSummerCollection(summer);
      })
      .catch(console.error);
  }, []);

  // Build product-type groups
  useEffect(() => {
    if (!productTypes.length) return;
    const groupMap = {};
    productTypes.forEach(pt => {
      const norm = pt.group.toLowerCase().replace(/[-\s]/g, "");
      if (EXCLUDED_GROUPS.some(ex => norm.includes(ex.replace(/[-\s]/g, "")))) return;
      if (!groupMap[pt.group]) {
        groupMap[pt.group] = { group: pt.group, image: pt.image, slug: pt.slug };
      }
    });
    setGroupedData(Object.values(groupMap));
  }, [productTypes]);

  // Build occasion cards
  useEffect(() => {
    if (!allProducts.length) return;
    const cards = OCCASION_CONFIG.map(oc => {
      const matched = allProducts.filter(p => p.occasion?.includes(oc.occasion));
      const picked  = matched[6] || matched[3] || matched[0];
      return {
        ...oc,
        image:
          picked?.variants?.[0]?.mainImage ||
          picked?.variants?.[0]?.images?.[0] ||
          "/placeholder.png",
      };
    });
    setOccasionCards(cards);
  }, [allProducts]);

  const handleGroupClick    = (slug, maxPrice)     => navigate(`/products/${slug}?maxPrice=${maxPrice}`);
  const handleOccasionClick = (occasion, maxPrice) => navigate(`/occasion/${occasion}?maxPrice=${maxPrice}`);
  const handleCollectionClick = (slug, maxPrice)   => navigate(`/products/${slug}?maxPrice=${maxPrice}`);

  const isLoading = ptLoading || prodLoading;

  return (
    <div className="genz-container">
      <div className="genz-header-row">
        <h2 className="genz-title">Clearance</h2>
        <span className="genz-subtitle">Limited time prices</span>
      </div>

      <div className="genz-slider">
        {isLoading ? (
          <SkeletonSlider />
        ) : (
          <>
            {/* Occasion Cards */}
            {occasionCards.map(oc => (
              <ClearanceCard
                key={oc.occasion}
                image={oc.image}
                label={oc.label}
                price={oc.price}
                ribbon="Sale"
                onClick={() => handleOccasionClick(oc.occasion, oc.maxPrice)}
              />
            ))}

            {/* Summer Collection */}
            {summerCollection && (
              <ClearanceCard
                image={summerCollection.image || "/placeholder.png"}
                label={summerCollection.name}
                price="Under ₹599"
                ribbon="New"
                onClick={() => handleCollectionClick(summerCollection.slug, 599)}
              />
            )}

            {/* Product Type Groups */}
            {groupedData.map((grp, i) => {
              const bucket = PRICE_BUCKETS[i] || PRICE_BUCKETS[PRICE_BUCKETS.length - 1];
              return (
                <ClearanceCard
                  key={grp.group}
                  image={grp.image || "/placeholder.png"}
                  label={grp.group}
                  price={bucket.label}
                  onClick={() => handleGroupClick(grp.slug, bucket.maxPrice)}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Clearance;