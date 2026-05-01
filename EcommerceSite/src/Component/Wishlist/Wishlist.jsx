import React from "react";
import "./Wishlist.css";
import { useWishlist } from "./WishlistContext";
import { useCart } from "../Cart/CartContext";
import { FaTrash, FaShoppingBag } from "react-icons/fa";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // 🛒 Move to Cart
  const moveToBag = (item) => {
    addToCart({
      _id: item._id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      qty: 1,
    });

    removeFromWishlist(item._id);
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">
        My Wishlist ({wishlistItems.length})
      </h2>

      {/* EMPTY STATE */}
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
            <div className="wishlist-card" key={item._id}>
              
              {/* ❌ REMOVE */}
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(item._id)}
              >
                <FaTrash />
              </button>

              {/* 🖼 IMAGE */}
              <img src={item.image} alt={item.title} />

              {/* 📄 DETAILS */}
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

                {/* 🛍 MOVE TO BAG */}
                <button
                  className="move-btn"
                  onClick={() => moveToBag(item)}
                >
                  <FaShoppingBag /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;