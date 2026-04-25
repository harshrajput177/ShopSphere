import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeProducts } from "../Store/Slices/ProductSlice";
import "../../Style-CSS/Landing-css/LandingCom3.css";

const FILTERS = [
  "Oversized T-Shirts",
  "Shirts",
  "Polos",
  "Hoodies",
  "Jackets",
  "Men Cargo Pants",
  "Men Jeans",
  "Women Tops",
  "Women Cargo Pants"
];

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);

  const allPrices =
    product.variants?.flatMap(
      (v) => v.sizes?.map((s) => Number(s.price)) || []
    ) || [];

  const navigate = useNavigate();

  const originalPrice =
    allPrices.length > 0 ? Math.min(...allPrices) : 0;

  const discountValue = product.discount || 0;

  const finalPrice = Math.max(
    0,
    originalPrice - discountValue
  );

  const discountPercent = originalPrice
    ? Math.round((discountValue / originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card-com3"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="card-image-wrap-COM3">
        <img
          src={
            product?.variants?.[0]?.mainImage ||
            product?.variants?.[0]?.images?.[0] ||
            "https://via.placeholder.com/200"
          }
          alt={product.title}
        />

        <div className="discount-badge">
          {discountPercent}% OFF
        </div>

        <button
          className={`wishlist-btn${
            wishlisted ? " active" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        <button
          className="cart-btn-circle"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Add to cart");
          }}
        >
          🛒
        </button>
      </div>

      <div className="card-body">
        <div className="card-category">
          {product.subCategory?.name}
        </div>

        <div className="card-title">
          {product.title}
        </div>

        <div className="card-pricing">
          <span className="price-current-com3">
            ₹ {finalPrice}
          </span>

          <span
            className="price-original-com3"
            style={{
              textDecoration: "line-through",
              color: "gray",
              marginLeft: "8px"
            }}
          >
            ₹ {originalPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FashionCards() {
  const dispatch = useDispatch();

  const { homeItems, loading } = useSelector(
    (state) => state.products
  );

  const trendingProducts =
    homeItems?.trending || [];

      console.log(trendingProducts);

  const [activeFilter, setActiveFilter] =
    useState("Men Cargo Pants");

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  // FILTER LOGIC
const filteredProducts = trendingProducts.filter((product) => {
  const title = (product.title || "").toLowerCase();
  const gender = (product.gender || "").toLowerCase();
  const subCategory = (product.subCategory?.name || "").toLowerCase();
  const productType = (product.productType?.name || "").toLowerCase();

  const searchableText = `
    ${title}
    ${subCategory}
    ${productType}
  `.toLowerCase();

  console.log(product.title, product.gender);

  switch (activeFilter) {
    case "Men Cargo Pants":
      return (
        gender === "men" &&
        searchableText.includes("cargo")
      );

    case "Women Cargo Pants":
      return (
        gender === "women" &&
        searchableText.includes("cargo")
      );

    case "Men Jeans":
      return (
        gender === "men" &&
        searchableText.includes("jeans")
      );

    case "Women Tops":
      return (
        gender === "women" &&
        searchableText.includes("top")
      );

    default:
      return true;
  }
});

  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Trending Now</h1>
        <p>
          New arrivals · Fresh drops · Limited stock
        </p>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab${
              activeFilter === f ? " active" : ""
            }`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
          />
        ))}
      </div>
    </div>
  );
}
