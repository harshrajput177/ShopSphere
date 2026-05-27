import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style-CSS/MobileView/CategoryMobileView.css";
import { X } from "lucide-react";
import axios from "axios";

const CategorySection = ({ title, data, onItemClick }) => {
  return (
    <div className="MobileView-category-section">
      <h2>{title}</h2>
      <div className="MobileView-category-grid">
        {Array.isArray(data) &&
          data.map((item) => (
            <div
              key={item._id}
              className="MobileView-category-card"
              onClick={() => onItemClick(item.slug)}  // ← yahan
              style={{ cursor: "pointer" }}
            >
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

    const navigate = useNavigate(); 

const handleItemClick = (slug) => {
  onClose();
  navigate(`/products/${slug}`);  // by-slug/ HATA DO
};

  useEffect(() => {
 const fetchData = async () => {
  try {

    const menRes = await axios.get("http://localhost:4000/api/product-type?gender=men")

 
    const womenRes = await axios.get("http://localhost:4000/api/product-type?gender=women");

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
      <div className="MobileView-category-container" onClick={(e) => e.stopPropagation()}>
        {/* ...header same... */}
        <div className="MobileView-category-page">
          <CategorySection title="Men's Clothing"   data={menData}   onItemClick={handleItemClick} />
          <CategorySection title="Women's Clothing" data={womenData} onItemClick={handleItemClick} />
          <CategorySection title="Kid's Fashion"    data={kidsData}  onItemClick={handleItemClick} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;