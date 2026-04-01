import React, { useState } from "react";
import "../../Style-CSS/ProductListing/ProductListing.css";
import FilterSidebar from "../ProductListing/FilterSlider";

const productsData = [
  {
    id: 1,
    name: "Janasya",
    title: "Mandarin Collar Printed Tunic",
    price: 643,
    oldPrice: 2219,
    discount: "71% OFF",
    rating: 4.2,
    reviews: 848,
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
  },
  {
    id: 2,
    name: "Sangria",
    title: "Printed Short Kurti",
    price: 454,
    oldPrice: 1699,
    discount: "73% OFF",
    rating: 4.2,
    reviews: 1700,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
  },
  {
    id: 3,
    name: "Rain & Rainbow",
    title: "Ethnic Motifs Kurti",
    price: 696,
    oldPrice: 1995,
    discount: "65% OFF",
    rating: 4.5,
    reviews: 1400,
    img: "https://images.unsplash.com/photo-1593032465171-8c43c0c5b34c"
  },
  {
    id: 4,
    name: "KALINI",
    title: "Women Embroidered Tunic",
    price: 660,
    oldPrice: 2279,
    discount: "71% OFF",
    rating: 4.2,
    reviews: 113,
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
  },
  {
    id: 5,
    name: "Biba",
    title: "Floral Printed Kurti",
    price: 799,
    oldPrice: 1999,
    discount: "60% OFF",
    rating: 4.4,
    reviews: 920,
    img: "https://images.unsplash.com/photo-1618354691438-25bc04584c23"
  },
  {
    id: 6,
    name: "W",
    title: "Solid Straight Kurta",
    price: 999,
    oldPrice: 2499,
    discount: "55% OFF",
    rating: 4.3,
    reviews: 640,
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157"
  },
  {
    id: 7,
    name: "KALINI",
    title: "Women Embroidered Tunic",
    price: 660,
    oldPrice: 2279,
    discount: "71% OFF",
    rating: 4.2,
    reviews: 113,
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
  },
  {
    id: 8,
    name: "Biba",
    title: "Floral Printed Kurti",
    price: 799,
    oldPrice: 1999,
    discount: "60% OFF",
    rating: 4.4,
    reviews: 920,
    img: "https://images.unsplash.com/photo-1618354691438-25bc04584c23"
  },
  {
    id: 9,
    name: "W",
    title: "Solid Straight Kurta",
    price: 999,
    oldPrice: 2499,
    discount: "55% OFF",
    rating: 4.3,
    reviews: 640,
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157"
  }
];

const ProductListing = () => {
  const [sortType, setSortType] = useState("");
  const [products, setProducts] = useState(productsData);

  const handleSort = (type) => {
    setSortType(type);

    let sorted = [...productsData];

    if (type === "low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (type === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (type === "latest") {
      sorted = [...productsData].reverse();
    }

    setProducts(sorted);
  };

  return (
    <div className="pl-container">

      {/* LEFT SIDE */}
      <div className="pl-left">

        {/* ✅ Breadcrumb LEFT TOP */}
        <div className="pl-breadcrumb">
          Home / Women / Ethnicwear / Pants
        </div>

        <FilterSidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="pl-products">

        {/* TOP BAR (ONLY SORT) */}
        <div className="pl-topbar">
          <div>
        <h2>Ethnic Tops For Women</h2></div>

          <div className="pl-sort">
            <span>Sort by:</span>
            <select onChange={(e) => handleSort(e.target.value)}>
              <option value="">Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Bestseller</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>


        {/* GRID */}
        <div className="pl-grid">
          {products.map((item) => (
            <div className="pl-card" key={item.id}>

              <div className="pl-img-wrap">
                <img src={item.img} alt={item.title} />

                <span className="pl-badge">Best Price</span>

                <div className="pl-actions">
                  <button>🛒</button>
                  <button>♡</button>
                </div>
              </div>

              <div className="pl-rating">⭐ {item.rating}</div>

              <div className="pl-info">
                <h4 className="pl-brand">{item.name}</h4>
                <p className="pl-title">{item.title}</p>

                <div className="pl-price">
                  <span className="current">₹{item.price}</span>
                  <span className="old">₹{item.oldPrice}</span>
                  <span className="off">{item.discount}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProductListing;