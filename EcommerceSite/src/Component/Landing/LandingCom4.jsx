import React, { useState, useRef } from "react";
import "../../Style-CSS/Landing-css/LandingCom4.css";

const PRODUCTS = [
  {
    id: 1,
    brand: "RANGMANCH",
    name: "Medium Blue Printed Women Regul...",
    
    currentPrice: 1044,
    originalPrice: 1899,
    discount: 45,
    badge: true,
    image: "https://images.unsplash.com/photo-1583846783214-8d2c31ef7e95?w=400&q=80",
  },
  {
    id: 2,
    brand: "RANGMANCH",
    name: "Maroon Floral Embroidered Mandar...",
    currentPrice: 974,
    originalPrice: 1299,
    discount: 25,
    badge: true,
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&q=80",
  },
  {
    id: 3,
    brand: "ANNABELLE",
    name: "Black Solid Slim Fit Formal Trouser",
    currentPrice: 974,
    originalPrice: 1299,
    discount: 25,
    badge: true,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5c?w=400&q=80",
  },
  {
    id: 4,
    brand: "HONEY",
    name: "Lilac Floral Fit & Flare Dress",
    currentPrice: 1359,
    originalPrice: 1699,
    discount: 20,
    badge: true,
    image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=80",
  },
  {
    id: 5,
    brand: "RANGMANCH",
    name: "Maroon Leaf Embroidered A-line K...",
    currentPrice: 1049,
    originalPrice: 1499,
    discount: 30,
    badge: true,
    image: "https://images.unsplash.com/photo-1511085279-4a8a5f43b8bc?w=400&q=80",
  },
  {
    id: 6,
    brand: "SF JEANS",
    name: "Indigo Regular Fit Stretch Jeans",
    currentPrice: 1189,
    originalPrice: 1699,
    discount: 30,
    badge: true,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80",
  },
  {
    id: 7,
    brand: "HONEY",
    name: "Rose Pink Embroidered Kurta Set",
    currentPrice: 1249,
    originalPrice: 1799,
    discount: 31,
    badge: true,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  },
  {
    id: 8,
    brand: "RANGMANCH",
    name: "Navy Blue Geometric Printed Kurta",
    currentPrice: 899,
    originalPrice: 1399,
    discount: 36,
    badge: false,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80",
  },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const VISIBLE = 5;

export default function TrendingNow() {
  const [current, setCurrent] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const maxIndex = PRODUCTS.length - VISIBLE;

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist((w) => w.includes(id) ? w.filter((i) => i !== id) : [...w, id]);
  };

  const CARD_WIDTH = 240; // px approx
  const GAP = 20;
  const translateX = current * (CARD_WIDTH + GAP);

  return (
    <section className="trending-section">
      <div className="trending-heading">
       <span> <h2>Best Sellers</h2>
        <p>Based On Your Recent Activity</p></span>

      </div>

      <div className="carousel-wrapper">
        {/* Left Button */}
        <button
          className="nav-btn left"
          onClick={handlePrev}
          disabled={current === 0}
          aria-label="Previous"
          style={{ opacity: current === 0 ? 0.38 : 1 }}
        >
          <ChevronLeft />
        </button>

        {/* Cards Track */}
        <div className="cards-track-outer">
          <div
            className="cards-track"
            style={{ transform: `translateX(-${current * (100 / VISIBLE)}%)` }}
          >
            {PRODUCTS.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="card-image-wrap">
                  <img src={p.image} alt={p.name} loading="lazy" />

                  {p.badge && (
                    <span className="badge-special">Online Special Price</span>
                  )}

                  <div className="card-actions">
                    <button className="action-icon" aria-label="Add to cart">
                      <CartIcon />
                    </button>
                    <button
                      className={`action-icon wishlist${wishlist.includes(p.id) ? " active" : ""}`}
                      aria-label="Wishlist"
                      onClick={(e) => toggleWishlist(p.id, e)}
                      style={wishlist.includes(p.id) ? { background: "#e74c3c", borderColor: "#e74c3c" } : {}}
                    >
                      <HeartIcon />
                    </button>
                  </div>
                </div>

                <div className="card-info">
                  <div className="card-brand">{p.brand}</div>
                  <div className="card-name">{p.name}</div>
                  <div className="card-pricing">
                    <span className="price-current">₹ {p.currentPrice.toLocaleString()}</span>
                    <span className="price-original">₹ {p.originalPrice.toLocaleString()}</span>
                    <span className="price-discount">{p.discount}% OFF</span>
                  </div>
                  <div className="card-gst">Inclusive of GST benefit</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          className="nav-btn right"
          onClick={handleNext}
          disabled={current >= maxIndex}
          aria-label="Next"
          style={{ opacity: current >= maxIndex ? 0.38 : 1 }}
        >
          <ChevronRight />
        </button>
      </div>

    </section>
  );
}










// const products = [
//   {
//     id: 1,
//     brand: "Forever Glam",
//     name: "Gold Shell Hinged Earrings",
//     price: 399,
//     image:
//       "https://images.unsplash.com/photo-1630018548695-a5d60e6a5d39?w=400&q=80",
//     bg: "#f5e9e2",
//   },
//   {
//     id: 2,
//     brand: "Forever Glam",
//     name: "Gold Shell Hinged Earrings",
//     price: 399,
//     image:
//       "https://images.unsplash.com/photo-1630018548695-a5d60e6a5d39?w=400&q=80",
//     bg: "#ede0d4",
//   },
//   {
//     id: 3,
//     brand: "Peter England",
//     name: "Medium Grey Textured Formal Men...",
//     price: 2499,
//     image:
//       "https://images.unsplash.com/photo-1594938298603-c8148c4b4b54?w=400&q=80",
//     bg: "#eef0ed",
//   },
//   {
//     id: 4,
//     brand: "Forever Glam",
//     name: "Multicoloured No-Show Socks - Pa...",
//     price: 299,
//     image:
//       "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&q=80",
//     bg: "#ececec",
//   },
//   {
//     id: 5,
//     brand: "Pantaloons Junior",
//     name: "Pink Anime Graphic Sweatshirt",
//     price: 799,
//     image:
//       "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
//     bg: "#fce4ec",
//   },
//   {
//     id: 6,
//     brand: "Pantaloons Junior",
//     name: "White Heart Print Sweatshirt",
//     price: 699,
//     image:
//       "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80",
//     bg: "#e8f4fd",
//   },
// ];