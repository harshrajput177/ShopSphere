import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style-CSS/MobileView/CategoryMobileView.css";
import { X } from "lucide-react";
import API from "../api/api"; 

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
              onClick={() => onItemClick(item.slug)}
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

  // ✅ Swipe down logic ke liye refs
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const CLOSE_THRESHOLD = 80;

  const handleItemClick = (slug) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  // ✅ Touch handlers
  const onTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  };

  const onTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    let deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY < 0) deltaY = 0; // Upar nahi jaane denge
    currentYRef.current = deltaY;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (currentYRef.current >= CLOSE_THRESHOLD) {
      // ✅ Close kar do
      if (sheetRef.current) {
        sheetRef.current.style.transition =
          "transform 0.35s cubic-bezier(0.32,0.72,0,1)";
        sheetRef.current.style.transform = "translateY(105%)";
      }
      setTimeout(onClose, 350);
    } else {
      // ✅ Wapas snap karo
      if (sheetRef.current) {
        sheetRef.current.style.transition =
          "transform 0.3s cubic-bezier(0.32,0.72,0,1)";
        sheetRef.current.style.transform = "translateY(0)";
      }
    }
    currentYRef.current = 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menRes, womenRes, kidsRes] = await Promise.all([
          API.get("/api/product-type?gender=men"),
          API.get("/api/product-type?gender=women"),
          API.get("/api/product-type?gender=kids"),
        ]);
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
        ref={sheetRef} // ✅ ref lagaya
        className="MobileView-category-container"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart} // ✅
        onTouchMove={onTouchMove}   // ✅
        onTouchEnd={onTouchEnd}     // ✅
      >
        {/* ✅ Drag Handle */}
        <div className="MobileView-drag-handle" />

        {/* ✅ Header with Close Button */}
        <div className="MobileView-category-header">
          <h3>Categories</h3>
          <X onClick={onClose} />
        </div>

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