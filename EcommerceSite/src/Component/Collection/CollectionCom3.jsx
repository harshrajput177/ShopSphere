
import React, { useEffect, useState } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ProductList from '../BestSeller/BestSelllerProduct';
import ColorList from '../BestSeller/BestSellerColor';
import CategoryList from '../BestSeller/BestSellerCategory';
import { useLocation } from "react-router-dom";
import { useFilter } from "../../Component/Context-API/Fillter-Context";

export default function Bestsellers() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const { selected, setSelected, handleSelection } = useFilter();
   const [price, setPrice] = useState(0);
   
    const maxPrice = 50000;

const location = useLocation();

useEffect(() => {
  if (location.state?.collectionName) {
    console.log("Setting collection:", location.state.collectionName);
    setSelected((prev) => ({ ...prev, collection: location.state.collectionName }));
  }
}, [location.state]);


  const handleRangeChange = (e) => {
    handleSelection("price", Number(e.target.value)); 
  };

  const handleToggle = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleToggleSortDropdown = () => {
    setOpenSortDropdown(!openSortDropdown);
  };

  const handleSelectSortOption = (option) => {
    setSelectedSort(option);
    // optional: setSelected({ ...selected, sort: option }); // if sorting is used in backend
    setOpenSortDropdown(false);
  };

  return (
    <>
      <div className="bestsellers-container">
        

        <div className="bestsellers-content">
          <div className="bestsellers-filters">
            <h3>Filters</h3>
            <div className="bestseller-boxes-1  for-all-boxes-btn">
                  {/* <button className="btn-sort" onClick={handleToggleSortDropdown}>
                    SORT - LOW TO HIGH <KeyboardArrowRightIcon className="Sort-Right-icon" />
                  </button> */}
                  {openSortDropdown && (
                    <ul className="SortPrice-dropdown">
                      {["2000 to 5000", "6000 to 8000", "8000 to 10,000", "10,000 to 15,000"].map((range) => (
                        <li key={range} onClick={() => handleSelectSortOption(range)}>
                          <input
                            type="radio"
                            name="sort"
                            checked={selectedSort === range}
                            onChange={() => handleSelectSortOption(range)}
                          />
                          {range}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
         

            <div className="AllSize-of-bestseller">
              <p className="firstparagraph">Size  <KeyboardArrowRightIcon /></p>
              <div className="bestsellers-size-options">
                {["38", "40", "42", "44",].map((size) => (
                  <button
                    key={size}
                    className={`bestsellers-size-button ${selected.size === size ? "active" : ""}`}
                    onClick={() => handleSelection("size", size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="Category-section">
              <CategoryList
                openDropdown={openDropdown}
                handleToggle={handleToggle}
                selected={selected}
                handleSelection={handleSelection}
              />

              {/* Color */}
              {/* <ColorList
                openDropdown={openDropdown}
                handleToggle={handleToggle}
                selected={selected}
                handleSelection={handleSelection}
              /> */}
            </div>
          </div>

          <div className="Bestseller-content-product">
    
            {/* product */}
            <ProductList  />

          </div>
        </div>
      </div>
      
    </>
  );
}