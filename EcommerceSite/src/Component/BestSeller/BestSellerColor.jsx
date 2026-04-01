import React, { useState } from "react";
import '../../Style-CSS/BestSeller-css/BestSellerColor.css';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { colors } from "../BestSeller/ColorSection";

export default function ColorSection({ openDropdown, handleToggle, selected, handleSelection }) {
  const [hoveredColor, setHoveredColor] = useState("Grey");

  const handleColorClick = (colorName) => {
    handleSelection("color", colorName);
  };

  return (
    <div className="Color-content" onClick={() => handleToggle("color")}>
      <h2 className="Category-content-All-h2">
        Color <KeyboardArrowRightIcon />
      </h2>
      {openDropdown === "color" && (
        <span className="bestSeller-Color-Container">
          <div className="bestSeller-Color-hover-box">
            {hoveredColor}
          </div>
          <div className="bestSeller-color-grid">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`bestSeller-color-circle ${selected?.color === color.name ? 'selected-color' : ''}`}
                style={{ backgroundColor: color.hex }}
                onMouseEnter={() => setHoveredColor(color.name)}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown toggle
                  handleColorClick(color.name);
                }}
              />
            ))}
          </div>
        </span>
      )}
    </div>
  );
}
