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
  { occasion: "Party", label: "Party Wear", price: "Under ₹599", maxPrice: 599 },
];

const Clearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: productTypes, loading: ptLoading } = useSelector(state => state.productType);
  const { allItems: allProducts, loading: prodLoading } = useSelector(state => state.products);

  const [groupedData, setGroupedData] = useState([]);
  const [occasionCards, setOccasionCards] = useState([]);
  const [summerCollection, setSummerCollection] = useState(null);

  useEffect(() => {
    if (!productTypes.length) dispatch(fetchProductTypes());
    if (!allProducts.length) dispatch(fetchAllProducts());

    // Summer collection API call
    API.get("/api/collection")
      .then(res => {
        const collections = res.data?.collections || res.data || [];
        const summer = collections.find(c =>
          c.name.toLowerCase().includes("summer")
        );
        if (summer) setSummerCollection(summer);
      })
      .catch(console.error);
  }, []);

  // ProductType groups
  useEffect(() => {
    if (!productTypes.length) return;
    const groupMap = {};
    productTypes.forEach(pt => {
      const normalizedGroup = pt.group.toLowerCase().replace(/[-\s]/g, "");
      if (EXCLUDED_GROUPS.some(ex => normalizedGroup.includes(ex.replace(/[-\s]/g, "")))) return;
      if (!groupMap[pt.group]) {
        groupMap[pt.group] = { group: pt.group, image: pt.image, slug: pt.slug };
      }
    });
    setGroupedData(Object.values(groupMap));
  }, [productTypes]);

  // Occasion cards
  useEffect(() => {
    if (!allProducts.length) return;
    const cards = OCCASION_CONFIG.map(oc => {
      const matchedProduct = allProducts.find(p => p.occasion?.includes(oc.occasion));
      return {
        ...oc,
        image: matchedProduct?.variants?.[0]?.mainImage ||
               matchedProduct?.variants?.[0]?.images?.[0] ||
               "/placeholder.png",
      };
    });
    setOccasionCards(cards);
  }, [allProducts]);

  const handleGroupClick = (slug, maxPrice) => {
    navigate(`/products/${slug}?maxPrice=${maxPrice}`);
  };

const handleOccasionClick = (occasion, maxPrice) => {
  navigate(`/occasion/${occasion}?maxPrice=${maxPrice}`); 
};
const handleCollectionClick = (slug, maxPrice) => {
  navigate(`/products/${slug}?maxPrice=${maxPrice}`); 
};

  if (ptLoading || prodLoading) return (
    <div className="genz-container">
      <h2 className="genz-title">Clearance</h2>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="genz-container">
      <h2 className="genz-title">Clearance</h2>
      <div className="genz-slider">


        {/* Occasion Cards */}
        {occasionCards.map(oc => (
          <div
            className="genz-card"
            key={oc.occasion}
            onClick={() => handleOccasionClick(oc.occasion, oc.maxPrice)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={oc.image}
              alt={oc.label}
              onError={e => (e.target.src = "/placeholder.png")}
            />
            <div className="genz-info"><p>{oc.label}</p></div>
            <div className="genz-price">{oc.price}</div>
          </div>
        ))}

        {/* Summer Collection Card */}
        {summerCollection && (
          <div
            className="genz-card"
            onClick={() => handleCollectionClick(summerCollection.slug, 599)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={summerCollection.image || "/placeholder.png"}
              alt={summerCollection.name}
              onError={e => (e.target.src = "/placeholder.png")}
            />
            <div className="genz-info"><p>{summerCollection.name}</p></div>
            <div className="genz-price">Under ₹599</div>
          </div>
        )}

        
        {groupedData.map((grp, i) => {
          const bucket = PRICE_BUCKETS[i] || PRICE_BUCKETS[PRICE_BUCKETS.length - 1];
          return (
            <div
              className="genz-card"
              key={grp.group}
              onClick={() => handleGroupClick(grp.slug, bucket.maxPrice)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={grp.image || "/placeholder.png"}
                alt={grp.group}
                onError={e => (e.target.src = "/placeholder.png")}
              />
              <div className="genz-info"><p>{grp.group}</p></div>
              <div className="genz-price">{bucket.label}</div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Clearance;