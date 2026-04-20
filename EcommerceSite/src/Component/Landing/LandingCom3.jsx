import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeProducts } from "../Store/Slices/ProductSlice";
import "../../Style-CSS/Landing-css/LandingCom3.css";

const FILTERS = [
  "Oversized T-Shirts", "Shirts", "Polos",
  "Hoodies", "Jackets", "Men Pants", "Men Jeans","Women Tops", "Women Pants"
];

function StarRating({ rating }) {
  const full = Math.floor(rating || 0);
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

  const price = product.price || 0;
  const originalPrice = product.discount || price;

  const discount = Math.round((1 - price / originalPrice) * 100) || 0;

  return (
    <div className="product-card-com3">
      <div className="card-image-wrap-COM3">
        <img
          src={product?.variants?.[0]?.images?.[0] || "https://via.placeholder.com/200"}
          alt={product.title}
        />

        <div className="discount-badge">{discount}% OFF</div>

        <button
          className={`wishlist-btn${wishlisted ? " active" : ""}`}
          onClick={() => setWishlisted(!wishlisted)}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-body">
        <div className="card-category">{product.subCategory?.name}</div>
        <div className="card-title">{product.title}</div>

        <div className="card-pricing">
          <span className="price-current">₹ {price}</span>
          <span className="price-original">₹ {originalPrice}</span>
        </div>

        <button className="add-to-cart-btn">
          🛍 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function FashionCards() {

  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.products);

  const trendingProducts = items.trending || [];

  const [activeFilter, setActiveFilter] = useState("Trending");

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

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
        {trendingProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
