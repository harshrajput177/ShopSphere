import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import "../../Style-CSS/Landing-css/LandingCom4.css";

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

// ✅ Alag ProductCard — optimistic wishlist ke liye
function ProductCard({ p, isWishlisted, onWishlist }) {
  const navigate = useNavigate();
  const [optimisticWished, setOptimisticWished] = useState(isWishlisted);

  useEffect(() => {
    setOptimisticWished(isWishlisted);
  }, [isWishlisted]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setOptimisticWished((prev) => !prev); // ✅ instant UI
    onWishlist(p, e);
  };

  const originalPrice = p?.variants?.[0]?.sizes?.[0]?.price || 0;
  const finalPrice = Math.max(0, originalPrice - (p?.discount || 0));

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${p._id}`)}
    >
      <div className="card-image-wrap">
        {/* ✅ lazy loading */}
        <img
          src={p?.variants?.[0]?.mainImage || p?.variants?.[0]?.images?.[0]}
          alt={p.title}
          loading="lazy"
          decoding="async"
          width="400"
          height="500"
        />

        <div className="card-actions">
          <button
            className={`action-icon wishlist ${optimisticWished ? "active" : ""}`}
            onClick={handleWishlistClick}
          >
            <HeartIcon />
          </button>
        </div>
      </div>

      <div className="card-info">
        <div className="card-brand">{p.specifications?.Brand}</div>
        <div className="card-name">{p.title}</div>
        <div className="card-pricing">
          <span className="price-current">₹ {finalPrice}</span>
          <span className="price-original">₹ {originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default function NewArrival() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redux wishlist & auth
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
       
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await axios.get(
          `${BASE_URL}/api/products/filter?isNewArrival=true`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("New arrivals fetch failed:", err.message);
      } finally {
        setLoading(false); // ✅ error aaye tab bhi loading hatao
      }
    };

    fetchNewArrivals();
  }, []);

  const getId = (item) => item?.productId?._id || item?.productId;

  const isWishlisted = useCallback(
    (id) => wishlistItems?.some((item) => getId(item) === id),
    [wishlistItems]
  );

  const handleWishlist = useCallback(
    (p, e) => {
      e.stopPropagation();

      if (!user) {
        navigate("?auth=login");
        return;
      }

      if (isWishlisted(p._id)) {
        dispatch(removeWishlist({ productId: p._id }));
      } else {
        dispatch(
          addWishlist({
            productId: p._id,
            title: p.title,
            price: Math.max(0, (p?.variants?.[0]?.sizes?.[0]?.price || 0) - (p?.discount || 0)),
            originalPrice: p?.variants?.[0]?.sizes?.[0]?.price || 0,
            image: p?.variants?.[0]?.mainImage || p?.variants?.[0]?.images?.[0],
            sizes: p?.variants?.[0]?.sizes || [],
          })
        );
      }
    },
    [dispatch, isWishlisted, user, navigate]
  );

  const handleNext = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  const handlePrev = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <section className="trending-section">
      <div className="trending-heading">
        <h2>New Arrivals</h2>
        <p>Based On Your Recent Activity</p>
      </div>

      <div className="carousel-wrapper">
        <button className="nav-btn-com4 left" onClick={handlePrev}>
          <ChevronLeft />
        </button>

        <div ref={scrollRef} className="cards-track-outer">
          <div className="cards-track">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                p={p}
                isWishlisted={isWishlisted(p._id)}
                onWishlist={handleWishlist}
              />
            ))}
          </div>
        </div>

        <button className="nav-btn-com4 right" onClick={handleNext}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}