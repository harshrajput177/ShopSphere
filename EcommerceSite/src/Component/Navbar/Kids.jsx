import React from "react";
import "../../Style-CSS/Navbar-css/MegaMenu.css";

const Kids = ({ onEnter, onLeave }) => {
  return (
    <div
      className="mega-menu-f"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mega-container">

        {/* Column 1 */}
        <div className="mega-column">
          <h4>Boys Clothing</h4>
          <p>T-Shirts</p>
          <p>Shirts</p>
          <p>Shorts</p>
          <p>Jeans</p>
          <p>Trousers</p>
          <p>Clothing Sets</p>
          <p>Ethnic Wear</p>
          <p>Track Pants & Pyjamas</p>
          <p>Jacket, Sweater & Sweatshirts</p>
          <p>Party Wear</p>
          <p>Innerwear & Thermals</p>
          <p>Nightwear & Loungewear</p>
          <p>Value Packs</p>
        </div>

        {/* Column 2 */}
        <div className="mega-column">
          <h4>Girls Clothing</h4>
          <p>Dresses</p>
          <p>Tops</p>
          <p>Tshirts</p>
          <p>Clothing Sets</p>
          <p>Lehenga choli</p>
          <p>Kurta Sets</p>
          <p>Party wear</p>
          <p>Dungarees & Jumpsuits</p>
          <p>Skirts & shorts</p>
          <p>Tights & Leggings</p>
          <p>Jeans, Trousers & Capris</p>
          <p>Jacket, Sweater & Sweatshirts</p>
          <p>Innerwear & Thermals</p>
          <p>Nightwear & Loungewear</p>
          <p>Value Packs</p>
        </div>

        {/* Column 3 */}
        <div className="mega-column">
          <h4>Footwear</h4>
          <p>Casual Shoes</p>
          <p>Flipflops</p>
          <p>Sports Shoes</p>
          <p>Flats</p>
          <p>Sandals</p>
          <p>Heels</p>
          <p>School Shoes</p>
          <p>Socks</p>

          <h4 className="mt">Toys & Games</h4>
          <p>Learning & Development</p>
          <p>Activity Toys</p>
          <p>Soft Toys</p>
          <p>Action Figure / Play set</p>
        </div>

        {/* Column 4 */}
        <div className="mega-column">
          <h4>Infants</h4>
          <p>Bodysuits</p>
          <p>Rompers & Sleepsuits</p>
          <p>Clothing Sets</p>
          <p>Tshirts & Tops</p>
          <p>Dresses</p>
          <p>Bottom wear</p>
          <p>Winter Wear</p>
          <p>Innerwear & Sleepwear</p>
          <p>Infant Care</p>

          <h4 className="mt">Home & Bath</h4>
          <h4>Personal Care</h4>
        </div>

        {/* Column 5 */}
        <div className="mega-column">
          <h4>Kids Accessories</h4>
          <p>Bags & Backpacks</p>
          <p>Watches</p>
          <p>Jewellery & Hair accessory</p>
          <p>Sunglasses</p>
          <p>Masks & Protective Gears</p>
          <p>Caps & Hats</p>

          <h4 className="mt">Brands</h4>
          <p>H&M</p>
          <p>Max Kids</p>
          <p>Pantaloons</p>
          <p>United Colors Of Benetton</p>
          <p>YK</p>
          <p>U.S. Polo Assn. Kids</p>
          <p>Mothercare</p>
          <p>HRX</p>
        </div>

      </div>
    </div>
  );
};

export default Kids;