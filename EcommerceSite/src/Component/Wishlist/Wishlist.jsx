import React, { useState } from "react";
import "./Wishlist.css";

const initialData = [
  {
    id: 1,
    brand: "KVS FAB",
    title: "Women Orange Embroidered Kurta Set",
    price: 2761,
    oldPrice: 9859,
    discount: 72,
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"
  },
  {
    id: 2,
    brand: "Juniper",
    title: "Ivory Floral Printed Rayon Lehenga",
    price: 1728,
    oldPrice: 4798,
    discount: 64,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"
  },
  {
    id: 3,
    brand: "LEOTUDE",
    title: "Typography Women's Pink T-shirt",
    price: 799,
    oldPrice: 1099,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1520975922284-9e0ce827c1dc"
  },
  {
    id: 4,
    brand: "H&M",
    title: "Women Blue Fitted Cotton T-shirt",
    price: 699,
    oldPrice: null,
    discount: null,
    image:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475"
  }
];

const Wishlist = () => {
  const [items, setItems] = useState(initialData);

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const moveToBag = (item) => {
    alert(`${item.title} moved to bag 🛒`);
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div className="wishlist-card" key={item.id}>
            {/* REMOVE BUTTON */}
            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              ✕
            </button>

            {/* IMAGE */}
            <img src={item.image} alt={item.title} />

            {/* CONTENT */}
            <div className="card-content">
              <h4>{item.brand}</h4>
              <p>{item.title}</p>

              <div className="price-box">
                <span className="price">₹{item.price}</span>

                {item.oldPrice && (
                  <>
                    <span className="old-price">
                      ₹{item.oldPrice}
                    </span>
                    <span className="discount">
                      {item.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <button
                className="move-btn"
                onClick={() => moveToBag(item)}
              >
                Move to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;