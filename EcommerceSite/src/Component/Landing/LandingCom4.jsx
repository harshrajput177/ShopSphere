import { useState, useEffect, useRef } from "react";
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

export default function BestSeller() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const { homeItems, loading } = useSelector((state) => state.products);
  const bestSeller = homeItems.bestSeller || [];

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist((w) =>
      w.includes(id) ? w.filter((i) => i !== id) : [...w, id]
    );
  };

  // 🔥 SIMPLE SCROLL
  const handleNext = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
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
        {/* Left */}
        <button className="nav-btn-com4 left" onClick={handlePrev}>
          <ChevronLeft />
        </button>

        {/* Cards */}
        <div ref={scrollRef} className="cards-track-outer">
          <div className="cards-track">
            {bestSeller.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="card-image-wrap">
                  <img
                    src={
                      p?.variants?.[0]?.mainImage ||
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
                    <span className="price-current">
                      ₹{" "}
                      {(p?.variants?.[0]?.sizes?.[0]?.price || 0) -
                        (p?.discount || 0)}
                    </span>

                    <span className="price-original">
                      ₹ {p?.variants?.[0]?.sizes?.[0]?.price || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <button className="nav-btn-com4 right" onClick={handleNext}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

