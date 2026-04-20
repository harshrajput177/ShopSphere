import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeProducts } from "../Store/Slices/ProductSlice";
import "../../Style-CSS/Landing-css/LandingCom4.css";

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

export default function BestSeller() {
  const dispatch = useDispatch();

  // 🔥 Redux state
  const { items, loading } = useSelector((state) => state.products);

  const bestSeller = items.bestSeller || [];

  const [current, setCurrent] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  const maxIndex = Math.max(0, bestSeller.length - VISIBLE);

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  // 🔥 API call (Redux)
  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist((w) =>
      w.includes(id) ? w.filter((i) => i !== id) : [...w, id]
    );
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <section className="trending-section">
      <div className="trending-heading">
        <span>
          <h2>Best Sellers</h2>
          <p>Based On Your Recent Activity</p>
        </span>
      </div>

      <div className="carousel-wrapper">
        {/* Left Button */}
        <button
          className="nav-btn left"
          onClick={handlePrev}
          disabled={current === 0}
          style={{ opacity: current === 0 ? 0.38 : 1 }}
        >
          <ChevronLeft />
        </button>

        {/* Cards */}
        <div className="cards-track-outer">
          <div
            className="cards-track"
            style={{ transform: `translateX(-${current * (100 / VISIBLE)}%)` }}
          >
            {bestSeller.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="card-image-wrap">
                  <img
                    src={
                      p?.variants?.[0]?.images?.[0] ||
                      "https://via.placeholder.com/200"
                    }
                    alt={p.title}
                  />

                  <div className="card-actions">
                    <button className="action-icon">
                      <CartIcon />
                    </button>

                    <button
                      className={`action-icon wishlist ${
                        wishlist.includes(p._id) ? "active" : ""
                      }`}
                      onClick={(e) => toggleWishlist(p._id, e)}
                    >
                      <HeartIcon />
                    </button>
                  </div>
                </div>

                <div className="card-info">
                  <div className="card-brand">
                    {p.specifications?.Brand}
                  </div>
                  <div className="card-name">{p.title}</div>

                  <div className="card-pricing">
                    <span className="price-current">₹ {p.price}</span>
                    <span className="price-original">₹ {p.discount}</span>
                  </div>
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