import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import "../../Style-CSS/MobileView/WishlistMobile.css";
import { fetchWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import { addCart } from "../Store/Slices/cartSlice";
import { useToast } from "../Toast/UseToast";
import ToastContainer from "../Toast/ToastContainer";

const WishlistView = ({ onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);
  const { toasts, showToast, removeToast } = useToast();

  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeWishlist({ productId: id }));
    showToast({ type: "success", title: "Removed from Wishlist", message: "You can add it back anytime", icon: "unheart" });
  };

  const getDiscount = (price, original) => {
    if (!original) return null;
    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="mobileview-wishlist-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="mobileview-wishlist-header">
        <FaArrowLeft onClick={onBack} />
        <h2>{user?.name}'s Wishlist</h2>
        <CiShoppingCart className="bag-icon" />
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && items.length === 0 && (
        <p style={{ textAlign: "center" }}>No items in wishlist</p>
      )}

      <div className="mobileview-wishlist-grid">
        {items.map((item) => (
          <div key={item._id} className="mobileview-wishlist-card">
            <img src={item.image} alt="" />

            <div className="mobileview-wishlist-info">
              <h4>{item.brand}</h4>
              <p>{item.title}</p>
              <div className="mobileview-wishlist-price">
                ₹{item.price}
                {item.originalPrice && (
                  <span className="mobileview-wishlist-old">₹{item.originalPrice}</span>
                )}
                {item.originalPrice && (
                  <span className="mobileview-wishlist-discount">
                    {getDiscount(item.price, item.originalPrice)}%
                  </span>
                )}
              </div>
            </div>

            <div className="mobileview-wishlist-actions">
              <button
                className="mobileview-wishlist-move-btn"
                onClick={() => {
                  setSelectedItem(item);
                  setOpenSizeModal(true);
                }}
              >
                Move to Bag
              </button>
              <div className="remove-icon" onClick={() => handleRemove(item.productId)}>
                <FaTimes />
              </div>
            </div>
          </div>
        ))}
      </div>

      {openSizeModal && (
        <div className="size-modal-overlay">
          <div className="mobile-size-modal">
            <div className="size-modal-header">
              <FaTimes onClick={() => setOpenSizeModal(false)} />
            </div>

            <h3>Select Size</h3>
            <p>{selectedItem?.brand} • {selectedItem?.title}</p>

            <div className="mobile-modal-size-options">
              {selectedItem?.sizes?.map((s) => (
                <button
                  key={s._id}
                  className={`mobile-modal-size-btn ${selectedSize?.size === s.size ? "mobile-modal-active" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s.size}
                </button>
              ))}
            </div>

            <hr />
            <br />

            <div className="size-modal-footer">
              <div>
                <h4>₹{selectedSize?.price || selectedItem?.price}</h4>
                {selectedItem?.originalPrice && (
                  <p>{getDiscount(selectedSize?.price || selectedItem?.price, selectedItem?.originalPrice)}% Off</p>
                )}
              </div>

              <button
                className="add-to-bag-btn"
                onClick={() => {
                  if (!selectedSize) {
                    showToast({ type: "info", title: "Please select a size", message: "Choose your size before adding to bag", icon: "ruler" });
                    return;
                  }
                  dispatch(addCart({ productId: selectedItem.productId, size: selectedSize.size, price: selectedSize.price, quantity: 1 }));
                  dispatch(removeWishlist({ productId: selectedItem._id }));
                  showToast({ type: "success", title: "Added to Bag!", message: `${selectedItem.title} — Size ${selectedSize.size}`, icon: "bag" });
                  setOpenSizeModal(false);
                  setSelectedSize(null);
                }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistView;