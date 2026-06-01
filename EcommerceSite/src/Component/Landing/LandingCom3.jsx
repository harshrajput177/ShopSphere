import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchHomeProducts } from "../Store/Slices/ProductSlice";
import "../../Style-CSS/Landing-css/LandingCom3.css";

const FILTERS = [
  "Men Oversized T-Shirts",
  "Shirts",
  "Women Oversized T-Shirts",
  "Women Shorts",
  "Men Cargo Pants",
  "Men Jeans",
  "Men Shorts",
  "Women Tops",
  "Women Cargo Pants"
];

function ProductCard({ product }) {
  
  const dispatch = useDispatch();
 const wishlistItems = useSelector((state) => state.wishlist.items);
const [selectedSize, setSelectedSize] = useState(null);
const { user } = useSelector((state) => state.auth);

  const allPrices =
  product?.variants?.flatMap((variant) =>
    (variant?.sizes || [])
      .map((size) => Number(size?.price || 0))
      .filter((price) => price > 0)
  ) || [];

  const navigate = useNavigate();

  const isWishlisted = wishlistItems?.some(
  (item) =>
    (item.productId?._id || item.productId) === product._id
);

  const [optimisticWished, setOptimisticWished] = useState(isWishlisted);
  
useEffect(() => {
  setOptimisticWished(isWishlisted);
}, [isWishlisted]);

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
  src={product?.variants?.[0]?.mainImage}
  alt={product.title}
  loading="lazy"        
  decoding="async"      
/>

        <div className="discount-badge">
          {discountPercent}% OFF
        </div>

           <button
  className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
onClick={(e) => {
  e.stopPropagation();
  if (!user) { navigate("?auth=login"); return; }

  setOptimisticWished((prev) => !prev); 

  if (isWishlisted) {
    dispatch(removeWishlist({ productId: product._id }));
  } else {
    dispatch(addWishlist({
      productId: product._id,
      title: product.title,
      price: finalPrice,
      originalPrice,
      image: product?.variants?.[0]?.mainImage,
      sizes: product?.variants?.[0]?.sizes || []
    }));
  }
}}
>
  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
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

      // console.log(trendingProducts);

  const [activeFilter, setActiveFilter] =
    useState("Men Cargo Pants");

  useEffect(() => {
    dispatch(fetchHomeProducts());
    
  }, [dispatch]);

  // FILTER LOGIC
const filteredProducts = trendingProducts.filter((product) => {
  const title = (product.title || "").toLowerCase();

  

  const gender =
    (product.subCategory?.gender?.name || "").toLowerCase();

  const subCategory =
    (product.subCategory?.name || "").toLowerCase();

  const productType =
    (product.productType?.name || "").toLowerCase();

  const fit =
    (product.specifications?.Fit || "").toLowerCase();


  const searchableText = `
    ${title}
    ${subCategory}
    ${productType}
    ${fit}
  `.toLowerCase();

  switch (activeFilter) {

  case "Men Oversized T-Shirts":
    return (
      gender === "men" &&
      productType.includes("t-shirt") &&
      fit.includes("oversized")
    );

  case "Women Oversized T-Shirts":
    return (
      gender === "women" &&
      productType.includes("t-shirt") &&
      fit.includes("oversized")
    );

  case "Men Cargo Pants":
    return (
      gender === "men" &&
      productType.includes("cargo")
    );

  case "Women Cargo Pants":
    return (
      gender === "women" &&
      productType.includes("cargo")
    );

  case "Shirts":
    return productType.includes("shirt") && !productType.includes("t-shirt");

  case "Men Jeans":
    return gender === "men" && productType.includes("jean");

  case "Women Shorts":
    return gender === "women" && productType.includes("short");

  case "Men Shorts":
    return gender === "men" && productType.includes("short");

  case "Women Tops":
    return gender === "women" && productType.includes("top");

  default:
    return true;
}

});


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
