import React, { useState, useEffect } from "react";
import "../../Style-CSS/ProductListing/FilterSlider.css";

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

const ColorSection = ({ colors, selected, onToggle }) => {
  const [open, setOpen] = useState(true);

  // Duplicates remove — case insensitive
  const uniqueColors = [...new Map(
    colors.map(c => [c.toLowerCase().trim(), c])
  ).values()];

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>Color</h4>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="filter-content">
          {uniqueColors.map((color, i) => (
            <label key={i} className="custom-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(color)}
                onChange={() => onToggle("Color", color)}
              />
              <span className="checkmark" />
              {color}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

//  Flags — Trending, Bestseller, New Arrival
const FlagsSection = ({ flags, selected, onToggle }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>Shop By</h4>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="filter-content">
          {flags.map((flag, i) => (
            <label key={i} className="custom-checkbox">
              <input
                type="checkbox"
                checked={!!selected[flag.key]}
                onChange={() => onToggle(flag.key)}
              />
              <span className="checkmark" />
              {flag.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

//  ProductType — id based toggle
const ProductTypeSection = ({ productTypes, selected, onToggle }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <h4>Category</h4>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="filter-content">
          {productTypes.map((pt, i) => (
            <label key={i} className="custom-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(pt.id)}
                onChange={() => onToggle("ProductType", pt.id)}
              />
              <span className="checkmark" />
              {pt.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ attributes, filterMeta, onFilterChange }) => {
  const [selected, setSelected] = useState({});
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (filterMeta?.priceRange?.max) {
      setPrice(filterMeta.priceRange.max);
    }
  }, [filterMeta]);

  // Checkbox toggle — string values (Color, Occasion, Size etc.)
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

  //  Flag toggle — boolean (isTrending, isBestSeller etc.)
  const toggleFlag = (key) => {
    setSelected(prev => {
      const next = { ...prev, [key]: !prev[key] };
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

      {/* 1. Dynamic Attributes — Fabric, Fit, Size (productType specific) */}
      {attributes.map(attr => (
        <FilterSection
          key={attr._id}
          title={attr.name}
          options={attr.options}
          selected={selected[attr.name] || []}
          onToggle={toggle}
        />
      ))}

            {/* 5. Occasion */}
      {filterMeta.occasions?.length > 0 && (
        <FilterSection
          title="Occasion"
          options={filterMeta.occasions}
          selected={selected["Occasion"] || []}
          onToggle={toggle}
        />
      )}

      {/* 6. ProductType — Jeans, Top, Shorts etc. */}
      {filterMeta.productTypes?.length > 0 && (
        <ProductTypeSection
          productTypes={filterMeta.productTypes}
          selected={selected["ProductType"] || []}
          onToggle={toggle}
        />
      )}


{filterMeta.subCategories?.length > 0 && (
  <FilterSection
    title="Style"
    options={filterMeta.subCategories}
    selected={selected["subCategories"] || []}  
    onToggle={(title, item) => toggle("subCategories", item)} // 🔥 title ignore, key fix
  />
)}


{filterMeta.genders?.length > 0 && (
  <FilterSection
    title="Gender"
    options={filterMeta.genders}
    selected={selected["Gender"] || []}
    onToggle={(title, item) => toggle("Gender", item)} // 🔥
  />
)}

      {/* 9.  Flags — Trending, Bestseller, New Arrival */}
      {filterMeta.flags?.length > 0 && (
        <FlagsSection
          flags={filterMeta.flags}
          selected={selected}
          onToggle={toggleFlag}
        />
      )}

      {/* 2. Price */}
      <div className="filter-section">
        <div className="filter-header"><h4>Price</h4></div>
        {price !== null && (
          <>
            <input
              type="range"
              min={filterMeta.priceRange?.min || 0}
              max={filterMeta.priceRange?.max || 10000}
              value={price}
              onChange={handlePrice}
              className="price-slider"
            />
            <div className="price-label">
              ₹{filterMeta.priceRange?.min || 0} – ₹{price}
            </div>
          </>
        )}
      </div>

      {/* 3. Color */}
      {filterMeta.colors?.length > 0 && (
        <ColorSection
          colors={filterMeta.colors}
          selected={selected["Color"] || []}
          onToggle={toggle}
        />
      )}

      {/* 4. Size — collection/occasion page */}
      {filterMeta.sizes?.length > 0 && (
        <FilterSection
          title="Size"
          options={filterMeta.sizes}
          selected={selected["Size"] || []}
          onToggle={toggle}
        />
      )}

    </div>
  );
};

export default FilterSidebar;