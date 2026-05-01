import React, { useEffect, useState } from "react";
import "../../Style-CSS/MobileView/CategoryMobileView.css";
import { X } from "lucide-react";
import axios from "axios";

const CategorySection = ({ title, data }) => {
  return (
    <div className="MobileView-category-section">
      <h2>{title}</h2>

      <div className="MobileView-category-grid">
        {Array.isArray(data) &&
          data.map((item) => (
            <div key={item._id} className="MobileView-category-card">
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

const CategoryPage = ({ onClose }) => {
  const [menData, setMenData] = useState([]);
  const [womenData, setWomenData] = useState([]);
  const [kidsData, setKidsData] = useState([]);

  useEffect(() => {
 const fetchData = async () => {
  try {
    // 🔥 MEN
    const menRes = await axios.get("http://localhost:4000/api/product-type?gender=men")

    // 🔥 WOMEN
    const womenRes = await axios.get("http://localhost:4000/api/product-type?gender=women");

    // 🔥 KIDS
    const kidsRes = await axios.get("http://localhost:4000/api/product-type?gender=kids");

console.log("MEN:", menRes.data);
console.log("WOMEN:", womenRes.data);
console.log("KIDS:", kidsRes.data);

    setMenData(menRes.data.productTypes || []);
    setWomenData(womenRes.data.productTypes || []);
    setKidsData(kidsRes.data.productTypes || []);

  } catch (err) {
    console.error(err);
  }
};

    fetchData();
  }, []);

  return (
    <div className="MobileView-category-overlay" onClick={onClose}>
      <div
        className="MobileView-category-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="MobileView-drag-handle"></div>

        <div className="MobileView-category-header">
          <h3>Categories</h3>
          <X onClick={onClose} />
        </div>

        <div className="MobileView-category-page">
          {/* 🔥 DYNAMIC DATA */}
          <CategorySection title="Men's Clothing" data={menData} />
          <CategorySection title="Women's Clothing" data={womenData} />
          <CategorySection title="Kid's Fashion" data={kidsData} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;