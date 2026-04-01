import React, { useState } from "react";
import "../../Style-CSS/ProductPage/ViewProduct.css";
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle, FiShare2 } from "react-icons/fi";

const images = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
  "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  "https://images.unsplash.com/photo-1593032465171-8c0c4b7c1c77"
];

const colors = [
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
  "https://images.unsplash.com/photo-1618354691373-d851f9c0f3b8",
  "https://images.unsplash.com/photo-1593032465171-8c0c4b7c1c77",
  "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
];

const ProductPage = () => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({});

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
    setZoomStyle({
      transform: "scale(1)"
    });
  };

  return (
    <div className="ViewProduct-product-container">
      {/* LEFT SIDE */}
      <div className="ViewProduct-image-section">
        <div className="thumbnail-list">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              onClick={() => setActiveImage(img)}
              className={activeImage === img ? "active-thumb" : ""}
            />
          ))}
        </div>

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

      {/* RIGHT SIDE */}
      <div className="ViewProduct-details-section">
       <h2 className="ViewProduct-title">
  This Ben Hogan Men's Solid Ottoman Golf Polo Shirt
</h2>

<p className="ViewProduct-description">
  Premium quality ottoman fabric polo shirt designed for comfort and performance.
  Perfect for casual wear and golf sessions, offering a breathable feel and modern fit.
</p>

        <div className="ViewProduct-rating">
          ⭐⭐⭐⭐⭐ <span>4.8</span> • 188 Reviews
        </div>

        <div className="ViewProduct-price">
          ₹187.500 <span className="ViewProduct-old-price">MRP 250.000</span>
          <span className="ViewProduct-discount">25% off</span>
          <h3  className="ViewProduct-inclusive-taxes">inclusive of all taxes</h3>
        </div>


        {/* MORE COLORS */}
<div className="ViewProduct-color-section">
  <p className="ViewProduct-section-title">More Colors</p>

  <div className="ViewProduct-color-list">
    {colors.map((img, i) => (
      <img
        key={i}
        src={img}
        alt="color"
        onClick={() => setActiveImage(img)}
        className={activeImage === img ? "active-color" : ""}
      />
    ))}
  </div>
</div>

        <div className="ViewProduct-size-section">
          <p>Select Size</p>
          <div className="ViewProduct-sizes">
            {["S", "M", "L", "XL", "2XL"].map((size) => (
              <button key={size}>{size}</button>
            ))}
          </div>
        </div>

        <button className="ViewProduct-buy-btn">Add to Wishlist</button>
        <button className="ViewProduct-cart-btn">Add to Bag</button>

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