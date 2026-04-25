import React, { useEffect, useState } from "react";
import "../../Style-CSS/ProductPage/ViewProduct.css";
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle, FiShare2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        const data = res.data;

        setProduct(data);

        // default variant
        const firstVariant = data?.variants?.[0];
        setSelectedVariant(firstVariant);

        setActiveImage(
          firstVariant?.mainImage || firstVariant?.images?.[0]
        );
      } catch (err) {
        console.log("Error fetching product", err);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔍 ZOOM
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // 💰 PRICE LOGIC
  const prices =
    selectedVariant?.sizes?.map((s) => Number(s.price)) || [];

  const originalPrice = prices.length ? Math.min(...prices) : 0;
  const discount = product.discount || 0;
  const finalPrice = Math.max(0, originalPrice - discount);

  return (
    <div className="ViewProduct-product-container">
      {/* LEFT */}
      <div className="ViewProduct-image-section">
        {/* THUMBNAILS */}
     <div className="thumbnail-list">
  {/* <div
    className="thumb-arrow"
    onClick={() => {
      document.querySelector(".thumbnail-scroll")
        .scrollBy({
          top: -150,
          behavior: "smooth"
        });
    }}
  >
  
  </div> */}

  <div className="thumbnail-scroll">
    {selectedVariant?.images?.map((img, i) => (
      <img
        key={i}
        src={img}
        onClick={() => setActiveImage(img)}
        className={
          activeImage === img ? "active-thumb" : ""
        }
      />
    ))}
  </div>

  {/* <div
    className="thumb-arrow"
    onClick={() => {
      document.querySelector(".thumbnail-scroll")
        .scrollBy({
          top: 150,
          behavior: "smooth"
        });
    }}
  >
    ▼
  </div> */}
</div>

        {/* MAIN IMAGE */}
        <div
          className="main-image-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={activeImage}
            alt="product"
            style={zoomStyle}
            className="main-image"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="ViewProduct-details-section">
<div className="ViewProduct-brand">
  {product.specifications?.Brand?.replace(/"/g, "").trim() || "No Brand"}
</div>

<h2 className="ViewProduct-title">
  {product.title}
</h2>


        {/* ⭐ Rating */}
        <div className="ViewProduct-rating">
          ⭐⭐⭐⭐⭐ <span>{product.rating || 4.5}</span>
        </div>

        {/* 💰 PRICE */}
        <div className="ViewProduct-price">
          ₹{finalPrice}
          <span className="ViewProduct-old-price">
            ₹{originalPrice}
          </span>
          <span className="ViewProduct-discount">
            {Math.round((discount / originalPrice) * 100) || 0}% off
          </span>

          <h3 className="ViewProduct-inclusive-taxes">
            inclusive of all taxes
          </h3>
        </div>

        {/* 🎨 VARIANTS (COLORS) */}
        <div className="ViewProduct-color-section">
          <p className="ViewProduct-section-title">Colors</p>

          <div className="ViewProduct-color-list">
            {product.variants?.map((variant, i) => (
              <img
                key={i}
                src={variant.mainImage || variant.images?.[0]}
                onClick={() => {
                  setSelectedVariant(variant);
                  setActiveImage(
                    variant.mainImage || variant.images?.[0]
                  );
                  setSelectedSize(null);
                }}
                className={
                  selectedVariant === variant ? "active-color" : ""
                }
              />
            ))}
          </div>
        </div>

        {/* 📏 SIZES */}
        <div className="ViewProduct-size-section">
          <p>Select Size</p>

          <div className="ViewProduct-sizes">
            {selectedVariant?.sizes?.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s)}
                className={
                  selectedSize?.size === s.size ? "active-size" : ""
                }
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

   {/* 🛒 BUTTONS */}
<button className="ViewProduct-buy-btn">
  ❤️ Add to Wishlist
</button>

<button className="ViewProduct-cart-btn">
  🛍 Add to Bag
</button>

{/* 📍 DELIVERY LOCATION */}
<div className="delivery-location-box">
  <h3>Select Delivery Location</h3>
  <p>
    Enter the pincode of your area to check product
    availability and delivery options
  </p>

  <div className="pincode-box">
    <div>
      <span>Enter Pincode</span>
      <h4>203001</h4>
    </div>
    <button>Edit</button>
  </div>

  <div className="delivery-status">
    Delivers to Bulandshahr - 203001 ✓
  </div>

  <div className="delivery-features">
    <div>
      <h4>COD available</h4>
      <span>Know More</span>
    </div>

    <div>
      <h4>7-day return & size exchange</h4>
      <span>Know More</span>
    </div>

    <div>
      <h4>Delivery by Tue, 28 Apr</h4>
      <span>Know More</span>
    </div>
  </div>
</div>

{/* 🎟 COUPONS */}
<div className="coupon-box">
  <h3>Coupons • 3 available</h3>

  <div className="coupon-list">
    <div className="single-coupon">
      <h4>Extra 15% off</h4>
      <p>
        Extra 15% off upto ₹200 on a minimum order
      </p>

      <div className="coupon-footer">
        <span>NFNEW15</span>
        <button>Copy Code</button>
      </div>
    </div>

    <div className="single-coupon">
      <h4>Extra 10% off</h4>
      <p>
        Get extra 10% off on your purchase
      </p>

      <div className="coupon-footer">
        <span>NFFLAT10</span>
        <button>Copy Code</button>
      </div>
    </div>
  </div>
</div>

{/* EXTRA */}
<div className="View-extra"></div>

        {/* EXTRA */}
        <div className="View-extra">
          <span>
            <FiMessageCircle className="view-icon" />
            Chat
          </span>

          <span>
            <FaRegHeart className="view-icon" />
            Wishlist
          </span>

          <span>
            <FiShare2 className="view-icon" />
            Share
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;