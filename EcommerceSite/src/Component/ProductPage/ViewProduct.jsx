import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart } from "../Store/Slices/cartSlice";
import { addWishlist, removeWishlist, fetchWishlist } from "../Store/Slices/wishlistSlice";
import { useNavigate, useParams } from "react-router-dom";
import "../../Style-CSS/ProductPage/ViewProduct.css";
import { FiMessageCircle, FiShare2 } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import CustomerReviews from "./CustomerReview";
import CouponBox from "./CouponBox";
import API from "../api/api";


// ── Chevron icon ─────────────────────────────────────────────
const Chevron = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.26s ease",
      flexShrink: 0,
      color: "#9898b0"
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Single Accordion Item ────────────────────────────────────
const AccItem = ({ icon, title, subtitle, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="vp-acc-item">
      <button className={`vp-acc-trigger ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)}>
        <div className="vp-acc-left">
          <span className="vp-acc-icon">{icon}</span>
          <div>
            <p className="vp-acc-title">{title}</p>
            {subtitle && <p className="vp-acc-sub">{subtitle}</p>}
          </div>
        </div>
        <Chevron open={open} />
      </button>
      <div className="vp-acc-body" style={{ maxHeight: open ? "800px" : "0px" }}>
        <div className="vp-acc-content">{children}</div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────
const ProductPage = ({ product, setProduct }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const wishlistItems = useSelector((state) => state.wishlist.items);


  const [pincode, setPincode] = useState("203001");
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const navigate = useNavigate();

  const checkPincode = async () => {
  if (pincode.length !== 6) {
    setPincodeError("6 digit pincode daalo");
    return;
  }
  setPincodeLoading(true);
  setPincodeError("");
  try {
const res = await API.get(`/api/pincode/check/${pincode}`);
    setPincodeInfo(res.data);
    setEditing(false);
  } catch (err) {
    setPincodeError("Try again Something wrong!");
  }
  setPincodeLoading(false);
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        const firstVariant = data?.variants?.[0];
        setSelectedVariant(firstVariant);
        setActiveImage(firstVariant?.mainImage || firstVariant?.images?.[0]);
      } catch (err) {
        console.log("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);


  useEffect(() => {
    if (!product) return;

    let recentProducts =
      JSON.parse(localStorage.getItem("recentViewed")) || [];

    // same product duplicate remove
    recentProducts = recentProducts.filter(
      (item) => item._id !== product._id
    );

    // new product top me add
    recentProducts.unshift(product);

    // sirf 10 products rakho
    recentProducts = recentProducts.slice(0, 10);

    localStorage.setItem(
      "recentViewed",
      JSON.stringify(recentProducts)
    );
  }, [product]);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [dispatch, user]);

  const getId = (item) => item?.productId?._id || item?.productId || null;
  const isWishlisted = product && wishlistItems?.some(item => getId(item) === product._id);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
  };
  const handleMouseLeave = () => setZoomStyle({ transform: "scale(1)" });

  const cleanVal = (v) => {
    if (v === null || v === undefined || v === "" || v === "null") return "—";
    if (Array.isArray(v)) return v.join(", ");
    return String(v).replace(/"/g, "").trim();
  };

  if (!product) return <h2 style={{ textAlign: "center", padding: "80px" }}>Loading...</h2>;

  const prices = selectedVariant?.sizes?.map((s) => Number(s.price)) || [];
  const originalPrice = prices.length ? Math.min(...prices) : 0;
  const discount = product.discount || 0;
  const finalPrice = Math.max(0, originalPrice - discount);
  const specs = product?.specifications ? Object.entries(product.specifications) : [];


  return (
    <div className="ViewProduct-product-container">

      {/* ── LEFT ── */}
      <div className="ViewProduct-image-section">
        <div className="thumbnail-list">
          <div className="thumbnail-scroll">
            {selectedVariant?.images?.map((img, i) => (
              <img key={i} src={img} onClick={() => setActiveImage(img)}
                className={activeImage === img ? "active-thumb" : ""} />
            ))}
          </div>
        </div>
        <div className="main-image-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <img src={activeImage} alt="product" style={zoomStyle} className="main-image" />
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="ViewProduct-details-section">

        {/* Brand */}
        <div className="ViewProduct-brand">
          {product.specifications?.Brand?.replace(/"/g, "").trim() || "Kelwor"}
        </div>

        {/* Title */}
        <h2 className="ViewProduct-title">{product.title}</h2>

        {/* Rating */}
        <div className="ViewProduct-rating">
          ⭐⭐⭐⭐⭐ <span>{product.rating || 4.5}</span>
        </div>

        {/* Price */}
        <div className="ViewProduct-price">
          ₹{finalPrice}
          <span className="ViewProduct-old-price">₹{originalPrice}</span>
          <span className="ViewProduct-discount">
            {Math.round((discount / originalPrice) * 100) || 0}% off
          </span>
          <h3 className="ViewProduct-inclusive-taxes">inclusive of all taxes</h3>
        </div>

        {/* Colors */}
        <div className="ViewProduct-color-section">
          <p className="ViewProduct-section-title">Select Color</p>
          <div className="ViewProduct-color-list">
            {product.variants?.map((variant, i) => (
              <img key={i}
                src={variant.mainImage || variant.images?.[0]}
                onClick={() => { setSelectedVariant(variant); setActiveImage(variant.mainImage || variant.images?.[0]); }}
                className={selectedVariant === variant ? "active-color" : ""}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="ViewProduct-size-section">
          <p>Select Size</p>
          <div className="ViewProduct-sizes">
            {selectedVariant?.sizes?.map((s) => (
              <button type="button" key={s.size}
                onClick={() => setSelectedSize({ size: s.size, price: s.price })}
                className={selectedSize?.size === s.size ? "active-size" : ""}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="product-btn-group">
          <button className="ViewProduct-Wish-btn"
            onClick={() => {
              if (!user) { alert("Please login first!"); navigate("?auth=login"); return; }
              if (isWishlisted) {
                dispatch(removeWishlist({ productId: product._id }));
              } else {
                dispatch(addWishlist({ productId: product._id, title: product.title, price: finalPrice, originalPrice, image: activeImage, sizes: selectedVariant?.sizes || [] }));
              }
            }}
          >
            {isWishlisted ? <FaHeart color="black" /> : <FaRegHeart />}
            <span>Wishlist</span>
          </button>

          <button type="button" className="ViewProduct-cart-btn"
            onClick={() => {
              if (!selectedSize?.size) { alert("Please select size"); return; }
              dispatch(addCart({ productId: product._id, size: selectedSize.size, title: product.title, image: activeImage, price: finalPrice, originalPrice }));
            }}
          >
            <FiShoppingBag />
            <span>Add to Bag</span>
          </button>
        </div>

     {/* Delivery */}
<div className="delivery-location-box">
  <h3>Check Delivery Options</h3>
  <p>Enter your pincode to check delivery availability and estimated date</p>

  <div className="pincode-input-row">
    {editing ? (
      <>
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit pincode"
          className="pincode-input"
          onKeyDown={(e) => e.key === "Enter" && checkPincode()}
        />
        <button className="pincode-check-btn" onClick={checkPincode}>
          {pincodeLoading ? (
            <span className="pincode-spinner" />
          ) : "Check"}
        </button>
      </>
    ) : (
      <div className="pincode-display-row">
        <div className="pincode-display-left">
          <span className="pincode-label">Delivery Pincode</span>
          <span className="pincode-value">{pincode}</span>
          {pincodeInfo?.city && (
            <span className="pincode-city">
              {pincodeInfo.city}, {pincodeInfo.state}
            </span>
          )}
        </div>
        <button className="pincode-change-btn" onClick={() => setEditing(true)}>
          Change
        </button>
      </div>
    )}
  </div>

  {pincodeError && (
    <p className="pincode-error">{pincodeError}</p>
  )}

  {pincodeInfo && (
    <div className="delivery-result">
      {pincodeInfo.serviceable ? (
        <>
          <div className="delivery-serviceable">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Delivery available at this pincode
          </div>

          <div className="delivery-features">
            <div className="delivery-feature-item">
              <span className="feature-icon">🚚</span>
              <div>
                <h4>Estimated Delivery</h4>
                <span>{pincodeInfo.estimated_delivery}</span>
              </div>
            </div>
            <div className="delivery-feature-item">
              <span className="feature-icon">💵</span>
              <div>
                <h4>{pincodeInfo.cod_available ? "COD Available" : "Prepaid Only"}</h4>
                <span>{pincodeInfo.cod_available ? "Pay on delivery" : "Online payment"}</span>
              </div>
            </div>
            <div className="delivery-feature-item">
              <span className="feature-icon">↩</span>
              <div>
                <h4>7-Day Returns</h4>
                <span>Free size exchange</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="delivery-not-available">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Delivery not available at this pincode
        </div>
      )}
    </div>
  )}
</div>

        {/* Coupons */}
    <CouponBox productId={product._id} orderAmount={finalPrice} />

    
        <div className="vp-info-heading">Product Information</div>

        <div className="vp-acc-group">

          {/* Product Details */}
          <AccItem icon="⊞" title="Product details" subtitle="Care instructions, Pack contains">
            <div className="vp-spec-grid">
              {specs.length > 0 ? specs.map(([key, val]) => (
                <div className="vp-spec-row" key={key}>
                  <span className="vp-spec-key">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                  </span>
                  <span className="vp-spec-val">{cleanVal(val)}</span>
                </div>
              )) : <p className="vp-empty">No details available.</p>}
            </div>
          </AccItem>

          {/* Know Your Product */}
          <AccItem icon="ⓘ" title="Know your product" subtitle="Description">
            <div className="vp-desc-block">
              <p>{cleanVal(product?.description)}</p>
              {product?.gender && (
                <div className="vp-spec-row">
                  <span className="vp-spec-key">Gender</span>
                  <span className="vp-spec-val">{cleanVal(product.gender)}</span>
                </div>
              )}
              {product?.category && (
                <div className="vp-spec-row">
                  <span className="vp-spec-key">Category</span>
                  <span className="vp-spec-val">{cleanVal(product.category)}</span>
                </div>
              )}
            </div>
          </AccItem>

          {/* Vendor Details */}
          <AccItem icon="👤" title="Vendor details" subtitle="Country of origin, Manufacturer details">
            <div className="vp-spec-grid">
              <div className="vp-spec-row">
                <span className="vp-spec-key">Brand</span>
                <span className="vp-spec-val">{cleanVal(product?.brand || product?.specifications?.Brand)}</span>
              </div>
              <div className="vp-spec-row">
                <span className="vp-spec-key">Country of Origin</span>
                <span className="vp-spec-val">India</span>
              </div>
              <div className="vp-spec-row">
                <span className="vp-spec-key">Marketed By</span>
                <span className="vp-spec-val">{cleanVal(product?.brand || "—")}</span>
              </div>
            </div>
          </AccItem>

          {/* Return Policy */}
          <AccItem icon="↩" title="Return and exchange policy" subtitle="Know more about return and exchange">
            <div className="vp-policy-list">
              {["7-day return policy from the date of delivery.",
                "Items must be unused, unwashed and in original packaging with tags intact.",
                "Free size exchange available within 7 days.",
                "Cash on Delivery available on all orders."
              ].map((txt, i) => (
                <div className="vp-policy-row" key={i}>
                  <span className="vp-policy-dot" />
                  <p>{txt}</p>
                </div>
              ))}
            </div>
          </AccItem>

        </div>

        <div className="vp-info-heading" style={{ marginTop: "32px" }}>Rating &amp; Reviews</div>
        <CustomerReviews />

      </div>

    </div>
  );
};

export default ProductPage;