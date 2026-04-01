import React from "react";
import "../../Style-CSS/MobileView/CategoryMobileView.css";
import { X } from "lucide-react";

const CategorySection = ({ title, items  }) => {
  return (
    <div className="MobileView-category-section">
      <h2>{title}</h2>

      <div className="MobileView-category-grid">
        {items.map((item, index) => (
          <div key={index} className="MobileView-category-card">
            <img src={item.img} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryPage = ({ onClose }) => {
  const menClothing = [
    { name: "Bottomwear", img: "/images/men1.png" },
    { name: "Topwear", img: "/images/men2.png" },
    { name: "Ethnic Wear", img: "/images/men3.png" },
    { name: "Budget buys", img: "/images/men4.png" },
    { name: "Casual Wear", img: "/images/men5.png" },
    { name: "Blazers & Suits", img: "/images/men6.png" },
    { name: "Formal Wear", img: "/images/men7.png" },
    { name: "Sports Wear", img: "/images/men8.png" },
  ];

  const menFootwear = [
    { name: "Sports Shoes", img: "/images/mf1.png" },
    { name: "Casual Shoes", img: "/images/mf2.png" },
    { name: "Shoes", img: "/images/mf3.png" },
    { name: "Sneakers", img: "/images/mf4.png" },
    { name: "Formal Shoes", img: "/images/mf5.png" },
    { name: "Spoil Fashion", img: "/images/mf6.png" },
  ];

  const womenClothing = [
    { name: "Kurta Sets", img: "/images/w1.png" },
    { name: "Sarees", img: "/images/w2.png" },
    { name: "Kurtis", img: "/images/w3.png" },
    { name: "Sweatshirts", img: "/images/w4.png" },
    { name: "Jeans", img: "/images/w5.png" },
    { name: "Jackets", img: "/images/w6.png" },
  ];

  const womenFootwear = [
    { name: "Sports Shoes", img: "/images/wf1.png" },
    { name: "Heels", img: "/images/wf2.png" },
    { name: "Slippers", img: "/images/wf3.png" },
    { name: "Boots", img: "/images/wf4.png" },
    { name: "Earrings", img: "/images/wf5.png" },
  ];

  const kidsFashion = [
    { name: "Kids Styles", img: "/images/k1.png" },
    { name: "Winter Wear", img: "/images/k2.png" },
    { name: "Sweaters", img: "/images/k3.png" },
    { name: "Shoes", img: "/images/k4.png" },
  ];

  return (
  <div className="MobileView-category-overlay" onClick={onClose}>
    
    <div 
      className="MobileView-category-container"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Drag Handle */}
      <div className="MobileView-drag-handle"></div>

      {/* Header */}
      <div className="MobileView-category-header">
        <h3>Categories</h3>
        <X onClick={onClose} />
      </div>

      {/* BODY */}
      <div className="MobileView-category-page">

        <CategorySection title="Men's Clothing" items={menClothing} />
        <CategorySection title="Men's Footwear & Accessories" items={menFootwear} />

        <CategorySection title="Women's Clothing" items={womenClothing} />
        <CategorySection title="Women's Footwear & Accessories" items={womenFootwear} />

        <CategorySection title="Kid's Fashion" items={kidsFashion} />

      </div>

    </div>
  </div>
  );
};

export default CategoryPage;