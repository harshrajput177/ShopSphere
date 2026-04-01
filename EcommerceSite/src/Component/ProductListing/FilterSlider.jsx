import React, { useState } from "react";
import "../../Style-CSS/ProductListing/FilterSlider.css";

const FilterSection = ({ title, options }) => {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="filter-section">
      
      {/* Header */}
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>{title}</h4>
        <span>{open ? "-" : "+"}</span>
      </div>

      {/* Content */}
      {open && (
        <div className="filter-content">

          {/* Search only for brand */}
          {title === "Brand" && (
            <input
              type="text"
              placeholder="Search brand..."
              className="filter-search"
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {filteredOptions.map((item, index) => (
            <label key={index} className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span>
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = () => {
  const [price, setPrice] = useState(5000);

  return (
    <div className="filter-sidebar">

      <h3 className="filter-title">FILTERS</h3>

      <FilterSection
        title="Category"
        options={["Kurtis", "Tops", "Tunics"]}
      />

      <FilterSection
        title="Size"
        options={["XS", "S", "M", "L", "XL", "XXL"]}
      />

      <FilterSection
        title="Brand"
        options={["SZN", "Anouk", "KALINI", "Biba", "W"]}
      />

      {/* PRICE */}
      <div className="filter-section">
        <div className="filter-header">
          <h4>Price</h4>
        </div>

        <input
          type="range"
          min="100"
          max="10000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="price-slider"
        />

        <div className="price-label">
          ₹100 - ₹{price}
        </div>
      </div>

      <FilterSection
        title="Discount"
        options={["10%+", "20%+", "30%+", "50%+", "70%+"]}
      />

      <FilterSection
        title="Occasion"
        options={["Casual", "Festive", "Party", "Wedding"]}
      />

      <FilterSection
        title="Material"
        options={["Cotton", "Silk", "Rayon", "Georgette"]}
      />

         <FilterSection
        title="Dress Style"
        options={[
          "A-Line",
          "Anarkali",
          "Straight",
          "Fit & Flare",
          "Bodycon",
          "Maxi",
          "Midi",
          "Shirt Dress"
        ]}
      />

      <FilterSection
        title="Color"
        options={["Red", "Blue", "Black", "White", "Pink"]}
      />

      <FilterSection
        title="Pattern"
        options={["Printed", "Solid", "Embroidered", "Floral"]}
      />

    </div>
  );
};

export default FilterSidebar;