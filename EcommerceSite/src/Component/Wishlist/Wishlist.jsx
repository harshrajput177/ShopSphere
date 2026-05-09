import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import "./Wishlist.css";

import { fetchWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import { addCart } from "../Store/Slices/cartSlice";

const WishlistView = () => {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.wishlist);

  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeWishlist({ productId: id }));
  };

  const getDiscount = (price, original) => {
    if (!original) return null;
    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="wishlist-container">
      
      {/* TITLE */}
      <h2 className="wishlist-title">
        My Wishlist ({items.length})
      </h2>

      {/* LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <p style={{ textAlign: "center" }}>No items in wishlist</p>
      )}

      {/* GRID */}
      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item._id} className="wishlist-card">

            {/* REMOVE */}
            <button
              className="wishlist-remove-btn"
              onClick={() => handleRemove(item.productId)}
            >
              <FaTimes  className="Fatimes"/>
            </button>

            {/* IMAGE */}
            <img src={item.image} alt={item.title} />

            {/* CONTENT */}
            <div className="card-content">
              <h4>{item.brand}</h4>
              <p>{item.title}</p>

              <div className="price-box">
                <span className="price">Rs.{item.price}</span>

                {item.originalPrice && (
                  <span className="old-price">
                    Rs.{item.originalPrice}
                  </span>
                )}

                {item.originalPrice && (
                  <span className="discount">
                    ({getDiscount(item.price, item.originalPrice)}% OFF)
                  </span>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="move-btn"
              onClick={() => {
                setSelectedItem(item);
                setOpenSizeModal(true);
              }}
            >
              MOVE TO BAG
            </button>

          </div>
        ))}
      </div>

      {/* SIZE MODAL */}
      {openSizeModal && (
        <div className="size-modal-overlay">
          <div className="size-modal">

            <div style={{ textAlign: "right" }}>
              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setOpenSizeModal(false)}
              />
            </div>

            <h3>Select Size</h3>

            <p>
              {selectedItem?.brand} • {selectedItem?.title}
            </p>

            {/* SIZE OPTIONS */}
            <div className="size-list">
              {selectedItem?.sizes?.map((s) => (
                <button
                  key={s._id}
                  className={
                    selectedSize?.size === s.size
                      ? "active-size"
                      : ""
                  }
                  onClick={() => setSelectedSize(s)}
                >
                  {s.size}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <h4>
                Rs.{selectedSize?.price || selectedItem?.price}
              </h4>

              {selectedItem?.originalPrice && (
                <p>
                  {getDiscount(
                    selectedSize?.price || selectedItem?.price,
                    selectedItem?.originalPrice
                  )}
                  % OFF
                </p>
              )}
            </div>

            {/* ADD TO BAG */}
            <button
              className="done-btn"
              onClick={() => {
                if (!selectedSize) {
                  alert("Select size first");
                  return;
                }

                dispatch(
                  addCart({
                    productId: selectedItem.productId,
                    size: selectedSize.size,
                    price: selectedSize.price,
                    quantity: 1,
                  })
                );

                dispatch(
                  removeWishlist({
                    productId: selectedItem.productId,
                  })
                );

                setOpenSizeModal(false);
                setSelectedSize(null);
              }}
            >
              ADD TO BAG
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistView;