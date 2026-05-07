import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterSidebar from "./FilterSlider";
import "../../Style-CSS/ProductListing/ProductListing.css";
 
const ProductListing = () => {
  const { slug } = useParams();
 
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [filterMeta, setFilterMeta] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortType, setSortType] = useState("");
  const [showFilter, setShowFilter] = useState(false); // 🔥 mobile filter toggle
 
  useEffect(() => {
    if (!slug) return;
 
    const fetchAll = async () => {
      try {
        const prodRes = await axios.get(
          `http://localhost:4000/api/products/by-slug/${slug}`
        );
        const { productType, products, filterMeta } = prodRes.data;
 
        const attrRes = await axios.get(
          `http://localhost:4000/api/attribute/product/${productType._id}`
        );
 
        setAllProducts(products);
        setFilteredProducts(products);
        setFilterMeta(filterMeta);
        setAttributes(attrRes.data);
      } catch (err) {
        console.error(err);
      }
    };
 
    fetchAll();
  }, [slug]);
 
  useEffect(() => {
    let result = [...allProducts];
 
    if (activeFilters.maxPrice) {
      result = result.filter(p =>
        p.variants.some(v => v.sizes.some(s => s.price <= activeFilters.maxPrice))
      );
    }
 
    if (activeFilters.Color?.length) {
      result = result.filter(p =>
        p.variants.some(v => activeFilters.Color.includes(v.color))
      );
    }
 
    if (activeFilters.Occasion?.length) {
      result = result.filter(p =>
        p.occasion.some(o => activeFilters.Occasion.includes(o))
      );
    }
 
    const sizeAttr = attributes.find(a => a.isSize);
    if (sizeAttr && activeFilters[sizeAttr.name]?.length) {
      result = result.filter(p =>
        p.variants.some(v =>
          v.sizes.some(s => activeFilters[sizeAttr.name].includes(String(s.size)))
        )
      );
    }
 
    attributes.filter(a => !a.isSize).forEach(attr => {
      if (activeFilters[attr.name]?.length) {
        result = result.filter(p => {
          let specValue;
          if (typeof p.specifications?.get === "function") {
            specValue = p.specifications.get(attr.name);
          } else {
            specValue = p.specifications?.[attr.name];
          }
          const cleanValue = String(specValue || "").replace(/^"+|"+$/g, "").trim();
          return activeFilters[attr.name].includes(cleanValue);
        });
      }
    });
 
    if (sortType === "low") {
      result.sort((a, b) => (a.variants[0]?.sizes[0]?.price || 0) - (b.variants[0]?.sizes[0]?.price || 0));
    } else if (sortType === "high") {
      result.sort((a, b) => (b.variants[0]?.sizes[0]?.price || 0) - (a.variants[0]?.sizes[0]?.price || 0));
    } else if (sortType === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortType === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
 
    setFilteredProducts(result);
  }, [activeFilters, sortType, allProducts, attributes]);
 
  return (
    <div className="pl-container">
 
      {/* ===== DESKTOP LEFT SIDEBAR ===== */}
      <div className="pl-left desktop-only">
     <div className="pl-breadcrumb">
  Home / Products / {slug?.replace(/-/g, " ")}
</div>
        {filterMeta && (
          <FilterSidebar
            attributes={attributes}
            filterMeta={filterMeta}
            onFilterChange={setActiveFilters}
          />
        )}
      </div>
 
      {/* ===== RIGHT PRODUCT AREA ===== */}
      <div className="pl-products">
 
        {/* Mobile breadcrumb */}
       <div className="pl-breadcrumb  mobile-pl-breadcrum">
  Home / Products / {slug?.replace(/-/g, " ")}
</div>
 
        <div className="pl-topbar">
          <h2>Products ({filteredProducts.length})</h2>
          <div className="pl-sort">
            <span className="desktop-only">Sort by:</span>
            <select value={sortType} onChange={e => setSortType(e.target.value)}>
              <option value="">Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Bestseller</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>
 
        {/* Product Grid */}
        <div className="pl-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(item => (
              <div className="pl-card" key={item._id}>
                <div className="pl-img-wrap">
                  <img
                    src={item.variants[0]?.mainImage || item.variants[0]?.images[0] || "/placeholder.png"}
                    alt={item.title}
                  />
                  <span className="pl-badge">Best Price</span>
                  <div className="pl-actions">
                    <button>🛒</button>
                    <button>♡</button>
                  </div>
                </div>
                <div className="pl-rating">⭐ {item.rating || 4.5}</div>
                <div className="pl-info">
                  <p className="pl-title">{item.title}</p>
                  <div className="pl-price">
                    <span className="current">₹{item.variants[0]?.sizes[0]?.price || 0}</span>
                    <span className="old">₹{(item.variants[0]?.sizes[0]?.price || 0) + 500}</span>
                    <span className="off">{item.discount ? `${item.discount}% OFF` : "20% OFF"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3>No Products Found</h3>
          )}
        </div>
      </div>
 
      <div className="mobile-bottom-bar mobile-only">
        <button className="mob-bar-btn" onClick={() => setSortType("")}>
          <span>⇅</span> Sort By
        </button>
        <div className="mob-bar-divider" />
        <button className="mob-bar-btn" onClick={() => setShowFilter(true)}>
          <span>⊟</span> Filter
          {Object.values(activeFilters).some(v =>
            Array.isArray(v) ? v.length > 0 : v !== null
          ) && <span className="filter-dot" />}
        </button>
      </div>
 
      {/* ===== MOBILE FILTER DRAWER ===== */}
      {showFilter && (
        <div className="mobile-filter-overlay" onClick={() => setShowFilter(false)}>
          <div
            className={`mobile-filter-drawer ${showFilter ? "open" : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <button className="drawer-close-btn" onClick={() => setShowFilter(false)}>✕</button>
            </div>
 
            {filterMeta && (
              <FilterSidebar
                attributes={attributes}
                filterMeta={filterMeta}
                onFilterChange={(filters) => {
                  setActiveFilters(filters);
                }}
              />
            )}
 
            <div className="mobile-filter-footer">
              <button
                className="mob-filter-clear"
                onClick={() => {
                  setActiveFilters({});
                  setShowFilter(false);
                }}
              >
                Clear All
              </button>
              <button
                className="mob-filter-apply"
                onClick={() => setShowFilter(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ProductListing;