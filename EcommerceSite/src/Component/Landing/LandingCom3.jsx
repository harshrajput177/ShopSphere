import { useState } from "react";
import "../../Style-CSS/Landing-css/LandingCom3.css";

const FILTERS = [
  "Trending", "Oversized T-Shirts", "Shirts", "Polos",
  "Hoodies", "Jackets", "Men Pants", "Men Jeans",
  "Men High Top Sneakers", "Men Low Top Sneakers",
];

const PRODUCTS = [
  {
    id: 1,
    title: "Plaid Shirt: Sea-Side",
    category: "Men Relaxed Shirts",
    price: 1599,
    originalPrice: 2299,
    fitLabel: "RELAXED FIT",
    fabricTag: null,
    isNew: false,
    rating: 4.5,
    ratingCount: 1284,
    colors: ["#c8a96e", "#1a1a1a", "#8b4513", "#3d5a3e"],
    moreColors: 2,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4aeb?w=600&q=80&fit=crop",
  },
  {
    id: 2,
    title: "Textured Shirt: Canyon",
    category: "Men Relaxed Shirts",
    price: 1399,
    originalPrice: 1999,
    fitLabel: "RELAXED FIT",
    fabricTag: "TEXTURED FABRIC",
    isNew: true,
    rating: 4.3,
    ratingCount: 876,
    colors: ["#d4b896", "#e8cdb0", "#f5e6d0", "#8b7355"],
    moreColors: 1,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80&fit=crop",
  },
  {
    id: 3,
    title: "Looney Tunes: Play It Again",
    category: "Oversized T-Shirts",
    price: 1099,
    originalPrice: 1799,
    fitLabel: "OVERSIZED FIT",
    fabricTag: "PREMIUM HEAVY GAUGE FABRIC",
    isNew: false,
    rating: 4.7,
    ratingCount: 3210,
    colors: ["#1a1a1a", "#ffffff", "#2c3e50", "#7f8c8d"],
    moreColors: 3,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop",
  },
  {
    id: 4,
    title: "Cotton Linen: Pastel Lime",
    category: "Cotton Linen Shirts",
    price: 1499,
    originalPrice: 2199,
    fitLabel: null,
    fabricTag: null,
    isNew: true,
    rating: 4.6,
    ratingCount: 2045,
    colors: ["#a8c68f", "#c5e1a5", "#81c784", "#4caf50"],
    moreColors: 2,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80&fit=crop",
    tag: "Made for all Indian Weather",
  },
];

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="stars">
      {Array(full).fill(0).map((_, i) => <span key={`f${i}`} className="star filled">★</span>)}
      {hasHalf && <span className="star half">★</span>}
      {Array(empty).fill(0).map((_, i) => <span key={`e${i}`} className="star empty">★</span>)}
    </div>
  );
}

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const saved = product.originalPrice - product.price;

  return (
    <div className="product-card-com3">
      <div className="card-image-wrap-COM3">
        <img src={product.image} alt={product.title} loading="lazy" />

        {product.fitLabel && <div className="fit-badge">{product.fitLabel}</div>}
        {product.isNew && <div className="new-label">NEW</div>}
        <div className="discount-badge">{discount}% OFF</div>

        {product.fabricTag && (
          <div className="fabric-tag">{product.fabricTag}</div>
        )}

        <button
          className={`wishlist-btn${wishlisted ? " active" : ""}`}
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Wishlist"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* Quick-add size selector on hover */}
        <div className="quick-add-overlay">
          {product.sizes.map((s) => (
            <button key={s} className="size-btn">{s}</button>
          ))}
        </div>
      </div>

      <div className="card-body">
        {/* Rating row */}
        <div className="card-rating">
          <span className="rating-value">{product.rating}</span>
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.ratingCount.toLocaleString()})</span>
        </div>

        <div className="card-category">{product.category}</div>
        <div className="card-title">{product.title}</div>

        {/* Pricing */}
        <div className="card-pricing">
          <span className="price-current">₹ {product.price.toLocaleString()}</span>
          <span className="price-original">₹ {product.originalPrice.toLocaleString()}</span>
          <span className="price-save">Save ₹{saved}</span>
        </div>

        {/* Color swatches */}
        <div className="card-colors">
          {product.colors.map((c, i) => (
            <div
              key={i}
              className={`color-dot${activeColor === i ? " active" : ""}`}
              style={{ background: c }}
              onClick={() => setActiveColor(i)}
            />
          ))}
          {product.moreColors > 0 && (
            <span className="more-colors">+{product.moreColors} more</span>
          )}
        </div>

        <button className="add-to-cart-btn">
          <span>🛍</span> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function FashionCards() {
  const [activeFilter, setActiveFilter] = useState("Trending");

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Trending Now</h1>
        <p>New arrivals · Fresh drops · Limited stock</p>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}