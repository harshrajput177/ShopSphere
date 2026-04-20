import { useState, useEffect } from "react";
import axios from "axios";
import "../../Style-CSS/Landing-css/LandingCom5.css";

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
const [products, setProducts] = useState([]);
const maxIndex = products.length - VISIBLE;;
const [loading, setLoading] = useState(true);

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist((w) => w.includes(id) ? w.filter((i) => i !== id) : [...w, id]);
  };

  useEffect(() => {
  const fetchNewArrivals = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/products/filter?isNewArrival=true"
      );

  console.log("API DATA:", res.data);
setProducts(res.data);

      
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  fetchNewArrivals();
}, []);
  

  const CARD_WIDTH = 240; // px approx
  const GAP = 20;
  const translateX = current * (CARD_WIDTH + GAP);

  if (loading) {
  return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
}

  return (
    <section className="trending-section">
      <div className="trending-heading">
        <h2>New Arrivals</h2>
        <p>Based On Your Recent Activity</p>
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
            {products.map((p) =>  (
             <div className="product-card" key={p._id}>
  
  <div className="card-image-wrap">
 <img 
  src={p?.variants?.[0]?.images?.[0] || "https://via.placeholder.com/200"} 
  alt={p.title} 
/>

    <div className="card-actions">
      <button className="action-icon">
        <CartIcon />
      </button>

      <button
        className={`action-icon wishlist${wishlist.includes(p._id) ? " active" : ""}`}
        onClick={(e) => toggleWishlist(p._id, e)}
      >
        <HeartIcon />
      </button>
    </div>
  </div>

  {/* ✅ INFO SECTION */}
  <div className="card-info">
    <div className="card-brand">{p.specifications?.Brand}</div>
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
          aria-label="Next"
          style={{ opacity: current >= maxIndex ? 0.38 : 1 }}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
