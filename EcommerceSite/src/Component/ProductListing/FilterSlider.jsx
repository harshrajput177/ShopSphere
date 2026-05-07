import React, { useState, useEffect } from "react";
import "../../Style-CSS/ProductListing/FilterSlider.css";

// Generic section — checkboxes
const FilterSection = ({ title, options, selected, onToggle }) => {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>{title}</h4>
        <span>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div className="filter-content">
          {options.length > 6 && (
            <input
              className="filter-search"
              placeholder={`Search ${title}...`}
              onChange={e => setSearch(e.target.value)}
            />
          )}
          {filtered.map((item, i) => (
            <label key={i} className="custom-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => onToggle(title, item)}
              />
              <span className="checkmark" />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// Color section — colored circles
const ColorSection = ({ colors, selected, onToggle }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>Color</h4>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="color-grid">
          {colors.map((color, i) => (
            <div
              key={i}
              className={`color-dot ${selected.includes(color) ? "active" : ""}`}
              style={{ background: color.toLowerCase() }}
              title={color}
              onClick={() => onToggle("Color", color)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ attributes, filterMeta, onFilterChange }) => {
  const [selected, setSelected] = useState({});
  const [price, setPrice] = useState(null);

  // Set max price on load
  useEffect(() => {
    if (filterMeta?.priceRange?.max) {
      setPrice(filterMeta.priceRange.max);
    }
  }, [filterMeta]);

  const toggle = (title, item) => {
    setSelected(prev => {
      const curr = prev[title] || [];
      const updated = curr.includes(item)
        ? curr.filter(v => v !== item)
        : [...curr, item];
      const next = { ...prev, [title]: updated };
      onFilterChange({ ...next, maxPrice: price });
      return next;
    });
  };

  const handlePrice = (e) => {
    const val = Number(e.target.value);
    setPrice(val);
    onFilterChange({ ...selected, maxPrice: val });
  };

  if (!filterMeta) return null;

  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">FILTERS</h3>

      {/* 1. Dynamic Attributes from DB (Fabric, Fit, Size etc.) */}
      {attributes.map(attr => (
        <FilterSection
          key={attr._id}
          title={attr.name}
          options={attr.options}
          selected={selected[attr.name] || []}
          onToggle={toggle}
        />
      ))}

      {/* 2. Price — from actual product data */}
      <div className="filter-section">
        <div className="filter-header"><h4>Price</h4></div>
        {price !== null && (
          <>
            <input
              type="range"
              min={filterMeta.priceRange.min}
              max={filterMeta.priceRange.max}
              value={price}
              onChange={handlePrice}
              className="price-slider"
            />
            <div className="price-label">
              ₹{filterMeta.priceRange.min} – ₹{price}
            </div>
          </>
        )}
      </div>

      {/* 3. Color — from actual product variants */}
      {filterMeta.colors?.length > 0 && (
        <ColorSection
          colors={filterMeta.colors}
          selected={selected["Color"] || []}
          onToggle={toggle}
        />
      )}

      {/* 4. Occasion — from actual product data */}
      {filterMeta.occasions?.length > 0 && (
        <FilterSection
          title="Occasion"
          options={filterMeta.occasions}
          selected={selected["Occasion"] || []}
          onToggle={toggle}
        />
      )}
    </div>
  );
};

export default FilterSidebar;