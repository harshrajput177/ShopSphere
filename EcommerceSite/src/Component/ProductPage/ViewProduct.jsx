import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addCart } from "../Store/Slices/cartSlice";
import { addWishlist } from "../Store/Slices/wishlistSlice";
import { fetchWishlist } from "../Store/Slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import "../../Style-CSS/ProductPage/ViewProduct.css";
import { FiMessageCircle, FiShare2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";




const ProductPage = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
const wishlistItems = useSelector((state) => state.wishlist.items);


  const navigate = useNavigate();



  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
       const res = await API.get(`/api/products/${id}`);
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

  useEffect(() => {
  if (user) {
    dispatch(fetchWishlist());
  }
}, [dispatch, user]);

const getId = (item) =>
  item?.productId?._id || item?.productId || null;

const isWishlisted =
  product &&
  wishlistItems &&
  wishlistItems.some((item) => {
    const id = getId(item);
    return id && id === product._id;
  });

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


        
        <div className="ViewProduct-rating">
          ⭐⭐⭐⭐⭐ <span>{product.rating || 4.5}</span>
        </div>

       
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
                }}
                className={
                  selectedVariant === variant ? "active-color" : ""
                }
              />
            ))}
          </div>
        </div>


        <div className="ViewProduct-size-section">
          <p>Select Size</p>

          <div className="ViewProduct-sizes">
            {selectedVariant?.sizes?.map((s) => (
              <button
                type="button"
                key={s.size}
                onClick={() => {
                  console.log("SIZE SELECTED:", s);
                  setSelectedSize({
                    size: s.size,
                    price: s.price,
                  });
                }}
                className={
                  selectedSize?.size === s.size ? "active-size" : ""
                }
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        <div className="product-btn-group">

  <button
  className="ViewProduct-Wish-btn"
  onClick={() => {
    if (!user) {
      alert("Please login first!");
      navigate("?auth=login");
      return;
    }

    if (isWishlisted) {
      dispatch(removeWishlist({ productId: product._id }));
    } else {
      dispatch(
        addWishlist({
          productId: product._id,
          title: product.title,
          price: finalPrice,
          originalPrice: originalPrice,
          image: activeImage,
          sizes: selectedVariant?.sizes || [],
        })
      );
    }
  }}
>
  {isWishlisted ? <FaHeart color="black" /> : <FaRegHeart />}
  <span>Wishlist</span>
</button>

          {/* 🛍 CART */}
          <button
            type="button"
            className="ViewProduct-cart-btn"
            onClick={() => {
              if (!selectedSize || !selectedSize.size) {
                alert("Please select size");
                return;
              }

              const mrp = selectedSize.price;
              const discount = product.discount || 0;
              const final = Math.max(0, mrp - discount);

dispatch(addCart({
  productId: product._id,
  size: selectedSize.size,
  title: product.title,
  image: activeImage,
  price: finalPrice,
  originalPrice: originalPrice,
}));
            }}
          >
            <FiShoppingBag />
            <span>Add to Bag</span>
          </button>

        </div>
     
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