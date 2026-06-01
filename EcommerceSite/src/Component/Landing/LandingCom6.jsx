import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHomeProducts } from "../Store/Slices/ProductSlice";
import { addWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import "../../Style-CSS/Landing-css/LandingCom6.css";

/* ── Icons ── */
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

/* ── Product Card ── */
function ProductCard({ p, isWishlisted, onWishlist }) {
  const navigate = useNavigate();
  const [optimisticWished, setOptimisticWished] = useState(isWishlisted);

  useEffect(() => {
    setOptimisticWished(isWishlisted);
  }, [isWishlisted]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setOptimisticWished((prev) => !prev);
    onWishlist(p, e);
  };

  const originalPrice = p?.variants?.[0]?.sizes?.[0]?.price || 0;
  const finalPrice    = Math.max(0, originalPrice - (p?.discount || 0));
  const discountPct   = originalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card-com6"
      onClick={() => navigate(`/product/${p._id}`)}
    >
      <div className="card-image-wrap">
        <img
          src={p?.variants?.[0]?.mainImage || p?.variants?.[0]?.images?.[0]}
          alt={p.title}
          loading="lazy"
          decoding="async"
          width="220"
          height="293"
        />

        {/* Badge */}
        {p?.badge && (
          <div className="badge-special">Online Special</div>
        )}

        {/* Action buttons */}
        <div className="card-actions">
          <button
            className={`action-icon wishlist ${optimisticWished ? "active" : ""}`}
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
          >
            <HeartIcon />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="card-info">
        <div className="card-brand">{p.specifications?.Brand}</div>
        <div className="card-name">{p.title}</div>

        <div className="card-pricing">
          <span className="price-current">
            ₹{finalPrice.toLocaleString("en-IN")}
          </span>
          <span className="price-original">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
          {discountPct > 0 && (
            <span className="price-discount">{discountPct}% off</span>
          )}
        </div>

        <div className="card-gst">Incl. of all taxes</div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function NewArrival() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const trackRef    = useRef(null);
  const [curIdx, setCurIdx] = useState(0);

  const { homeItems, loading } = useSelector((state) => state.products);
  const wishlistItems          = useSelector((state) => state.wishlist.items);
  const { user }               = useSelector((state) => state.auth);

  const newArrival = homeItems.newArrival || [];

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  /* ── Wishlist helpers ── */
  const getId = (item) => item?.productId?._id || item?.productId;

  const isWishlisted = useCallback(
    (id) => wishlistItems?.some((item) => getId(item) === id),
    [wishlistItems]
  );

  const handleWishlist = useCallback(
    (p, e) => {
      e.stopPropagation();
      if (!user) { navigate("?auth=login"); return; }

      if (isWishlisted(p._id)) {
        dispatch(removeWishlist({ productId: p._id }));
      } else {
        dispatch(
          addWishlist({
            productId:     p._id,
            title:         p.title,
            price:         Math.max(0, (p?.variants?.[0]?.sizes?.[0]?.price || 0) - (p?.discount || 0)),
            originalPrice: p?.variants?.[0]?.sizes?.[0]?.price || 0,
            image:         p?.variants?.[0]?.mainImage || p?.variants?.[0]?.images?.[0],
            sizes:         p?.variants?.[0]?.sizes || [],
          })
        );
      }
    },
    [dispatch, isWishlisted, user, navigate]
  );

  /* ── Carousel logic ── */
  const getCardWidth = () => {
    const card = trackRef.current?.querySelector(".product-card-com6");
    return card ? card.offsetWidth + 16 : 236;
  };

  const getVisible  = () => (window.innerWidth <= 600 ? 2 : 4);
  const getMaxIdx   = () => Math.max(0, newArrival.length - getVisible());
  const getDotCount = () => getMaxIdx() + 1;

  const goTo = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(idx, getMaxIdx()));
      setCurIdx(clamped);
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${clamped * getCardWidth()}px)`;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newArrival.length]
  );

  const handlePrev = () => goTo(curIdx - 1);
  const handleNext = () => goTo(curIdx + 1);

  /* recalculate on resize */
  useEffect(() => {
    const onResize = () => goTo(Math.min(curIdx, getMaxIdx()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curIdx, newArrival.length]);

  return (
    <section className="trending-section">
     <div className="trending-heading">
  <span className="heading-eyebrow">New Arrivals</span>
  <h2><em>Trending</em> Right Now</h2>
  <p>Based on your recent activity</p>
</div>

      {/* Carousel */}
      <div className="carousel-outer">
      <div className="carousel-wrapper">
        <button className="nav-btn left" onClick={handlePrev} aria-label="Previous">
          <ChevronLeft />
        </button>

        <div className="cards-track-outer">
          <div className="cards-track" ref={trackRef}>
            {newArrival.map((p) => (
              <ProductCard
                key={p._id}
                p={p}
                isWishlisted={isWishlisted(p._id)}
                onWishlist={handleWishlist}
              />
            ))}
          </div>
        </div>

        <button className="nav-btn right" onClick={handleNext} aria-label="Next">
          <ChevronRight />
        </button>
      </div>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {Array.from({ length: getDotCount() }).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === curIdx ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}