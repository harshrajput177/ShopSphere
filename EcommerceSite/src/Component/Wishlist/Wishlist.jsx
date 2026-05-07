import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import "../../Style-CSS/MobileView/WishlistMobile.css";
import { FaArrowLeft } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { fetchWishlist, removeWishlist } from "../Store/Slices/wishlistSlice";
import { addCart } from "../Store/Slices/cartSlice";
import CartDrawer from "../Cart/FilledCart"; 

const WishlistView = ({ onBack }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);
  const cartItems = useSelector((state) => state.cart.items); 

  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showCart, setShowCart] = useState(false); 

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (selectedItem) {
      console.log("Sizes Data:", selectedItem.sizes);
    }
  }, [selectedItem]);

  const handleRemove = (id) => {
    dispatch(removeWishlist({ productId: id }));
  };

  const getDiscount = (price, original) => {
    if (!original) return null;
    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="mobileview-wishlist-container">

      {/* HEADER */}
      <div className="mobileview-wishlist-header">
        <FaArrowLeft onClick={onBack} />
        <h2>{user?.name}'s Wishlist</h2>

        {/* CART ICON with badge */}
        <div
          className="wishlist-cart-icon-wrapper"
          
          onClick={() => {console.log("Cart icon clicked!") ; setShowCart(true)}}
        >
          <CiShoppingCart className="bag-icon" />
          {totalQty > 0 && (
            <span className="wishlist-cart-badge">{totalQty}</span>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <p style={{ textAlign: "center" }}>No items in wishlist</p>
      )}

      {/* GRID */}
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

            {/* ACTIONS */}
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

      {/* SIZE MODAL */}
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
                  <p>
                    {getDiscount(
                      selectedSize?.price || selectedItem?.price,
                      selectedItem?.originalPrice
                    )}% Off
                  </p>
                )}
              </div>

              <button
                className="add-to-bag-btn"
                onClick={() => {
                  if (!selectedSize) {
                    alert("Select size first");
                    return;
                  }

                  dispatch(addCart({
                    productId: selectedItem.productId,
                    size: selectedSize.size,
                    price: selectedSize.price,
                    quantity: 1,
                  }));

                  dispatch(removeWishlist({ productId: selectedItem._id }));
                  setOpenSizeModal(false);
                  setSelectedSize(null);

                  // ← Move to Bag ke baad CartDrawer auto open
                  setShowCart(true);
                }}
              >
                Add to Bag
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CART DRAWER - wishlist ke upar khulega */}
      {showCart && (
        <CartDrawer onClose={() => setShowCart(false)} />
      )}

    </div>
  );
};

export default WishlistView;