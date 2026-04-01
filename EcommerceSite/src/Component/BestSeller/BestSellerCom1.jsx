import React, { useState } from "react";
import "../../Style-CSS/BestSeller-css/BestSellerCom1.css";
import ProductList from './BestSelllerProduct';
import Banner from './BestSellerBanner';
import { useFilter } from "../../Component/Context-API/Fillter-Context";
import FilterSection from '../BestSeller/Btn-Comp-Bestseller/ReuseFillter';
import SortFilterBar from "../FillterBarMobile/SortFillterBar";


export default function Bestsellers() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { selected, setSelected } = useFilter();

  const handleToggle = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleSelection = (section, value) => {
    setSelected({ ...selected, [section]: value });
  };


  return (
    <>
      <div className="bestsellers-container">
        <div className="bestseller-MainHeading">
          <h2 className="bestsellers-title">BESTSELLERS OF ISHUM</h2>
  
        </div>

        <div className="bestsellers-content">
  <FilterSection
  selected={selected}
  handleSelection={handleSelection}
  openDropdown={openDropdown} 
  handleToggle={handleToggle}
/>

          <div className="Bestseller-content-product">
            <div className="Allproduct-Boxes">
              <div className="store-bestseller">
                <h3><a href="/">STORE</a> / <a href="/Ishum-Exclusive">ISHUM-EXCLUSIVE</a></h3>
        <button  className="Clear-Filter"><a href="/bestsellers">Clear Filter</a></button>
              </div>
            
            </div>

            {/* product */}
            <ProductList queryParam="isBestseller=true"/>
          </div>
        </div>
      </div>
      <Banner />
<div className="Mobile-SortFilterBar">      <SortFilterBar  /></div>
    </>
  );
}
