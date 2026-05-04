import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { FaTrash, FaShoppingBag } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeWishlist,
} from "../Store/Slices/wishlistSlice";

import { addCart } from "../Store/Slices/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
const [showSizeModal, setShowSizeModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [selectedSize, setSelectedSize] = useState(null);
  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // 🔥 LOAD DATA
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);



const handleMoveClick = (item) => {
    console.log("CLICK ITEM:", item);
  setSelectedItem(item);
  
  setShowSizeModal(true);
};

useEffect(() => {
  console.log("SELECTED ITEM:", selectedItem);
}, [selectedItem]);

  const moveToBag = (item) => {
    dispatch(
      addCart({
         productId: item.productId._id || item.productId,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        size: item.size || "M",
      })
    );

    dispatch(
      removeWishlist({
       productId: item.productId._id || item.productId
      })
    );
  };

return (
  <>
    <div className="wishlist-container">
      <h2 className="wishlist-title">
        My Wishlist ({wishlistItems.length})
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
            alt="empty"
          />
          <h3>Your Wishlist is Empty</h3>
          <p>Save items you love ❤️</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div
              className="wishlist-card"
              key={item.productId._id || item.productId}
              onClick={() =>
                navigate(
                  `/product/${item.productId._id || item.productId}`
                )
              }
            >
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    removeWishlist({
                      productId:
                        item.productId._id || item.productId,
                    })
                  );
                }}
              >
                <FaTrash />
              </button>

              <img src={item.image} alt={item.title} />

              <div className="card-content">
                <h4>{item.title}</h4>

                <div className="price-box">
                  <span className="price">₹{item.price}</span>

                  {item.originalPrice && (
                    <>
                      <span className="old-price">
                        ₹{item.originalPrice}
                      </span>
                      <span className="discount">
                        {Math.round(
                          ((item.originalPrice - item.price) /
                            item.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>

                <button
                  className="move-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveClick(item);
                  }}
                >
                  <FaShoppingBag /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

{showSizeModal && selectedItem && (
  <div className="size-modal-overlay">
    <div className="size-modal">

      {/* 🔥 PRODUCT INFO */}
      <div className="modal-product">
        <img src={selectedItem.image} alt="" />

        <div>
          <h4>{selectedItem.title}</h4>

          <p>
            ₹{selectedItem.price}
            <span className="old">
              ₹{selectedItem.originalPrice}
            </span>
            <span className="off">
              {Math.round(
                ((selectedItem.originalPrice - selectedItem.price) /
                  selectedItem.originalPrice) *
                  100
              )}
              % OFF
            </span>
          </p>
        </div>
      </div>

      <hr />

      <h3>Select Size</h3>

  <div className="size-list">
  {selectedItem?.sizes?.map((s) => (
    <button
      key={s.size}
      className={selectedSize === s.size ? "active-size" : ""}
      onClick={() => setSelectedSize(s.size)}
    >
      {s.size}
    </button>
  ))}
</div>

      <button
        className="done-btn"
        onClick={() => {
          if (!selectedSize) {
            alert("Please select size");
            return;
          }

          dispatch(addCart({
            productId:
              selectedItem.productId._id || selectedItem.productId,
            size: selectedSize,
          }));

          dispatch(removeWishlist({
            productId:
              selectedItem.productId._id || selectedItem.productId,
          }));

          setShowSizeModal(false);
          setSelectedSize(null);
        }}
      >
        Done
      </button>
    </div>
  </div>
)}
  </>
);
};

export default Wishlist;