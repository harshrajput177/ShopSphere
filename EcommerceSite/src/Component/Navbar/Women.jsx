import React from "react";
import "../../Style-CSS/Navbar-css/MegaMenu.css";

const Women = ({ onEnter, onLeave }) => {
  return (
    <div
      className="mega-menu-f"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mega-container">

        {/* Column 1 */}
        <div className="mega-column">
          <h4>Indian & Fusion Wear</h4>
          <p>Kurtas & Suits</p>
          <p>Kurtis, Tunics & Tops</p>
          <p>Sarees</p>
          <p>Ethnic Wear</p>
          <p>Leggings, Salwars & Churidars</p>
          <p>Skirts & Palazzos</p>
          <p>Dress Materials</p>
          <p>Lehenga Cholis</p>
          <p>Dupattas & Shawls</p>
          <p>Jackets</p>

          <h4 className="mt">Belts, Scarves & More</h4>
          <h4>Watches & Wearables</h4>
        </div>

        {/* Column 2 */}
        <div className="mega-column">
          <h4>Western Wear</h4>
          <p>Dresses</p>
          <p>Tops</p>
          <p>Tshirts</p>
          <p>Jeans</p>
          <p>Trousers & Capris</p>
          <p>Shorts & Skirts</p>
          <p>Co-ords</p>
          <p>Playsuits</p>
          <p>Jumpsuits</p>
          <p>Shrugs</p>
          <p>Sweaters & Sweatshirts</p>
          <p>Jackets & Coats</p>
          <p>Blazers & Waistcoats</p>

          <h4 className="mt">Plus Size</h4>
        </div>

        {/* Column 3 */}
        <div className="mega-column">
          <h4>Maternity</h4>

          <h4 className="mt">Sunglasses & Frames</h4>

          <h4 className="mt">Footwear</h4>
          <p>Flats</p>
          <p>Casual Shoes</p>
          <p>Heels</p>
          <p>Boots</p>
          <p>Sports Shoes & Floaters</p>

          <h4 className="mt">Sports & Active Wear</h4>
          <p>Clothing</p>
          <p>Footwear</p>
          <p>Sports Accessories</p>
          <p>Sports Equipment</p>
        </div>

        {/* Column 4 */}
        <div className="mega-column">
          <h4>Lingerie & Sleepwear</h4>
          <p>Bra</p>
          <p>Briefs</p>
          <p>Shapewear</p>
          <p>Sleepwear & Loungewear</p>
          <p>Swimwear</p>
          <p>Camisoles & Thermals</p>

          <h4 className="mt">Beauty & Personal Care</h4>
          <p>Makeup</p>
          <p>Skincare</p>
          <p>Premium Beauty</p>
          <p>Lipsticks</p>
          <p>Fragrances</p>
        </div>

        {/* Column 5 */}
        <div className="mega-column">
          <h4>Gadgets</h4>
          <p>Smart Wearables</p>
          <p>Fitness Gadgets</p>
          <p>Headphones</p>
          <p>Speakers</p>

          <h4 className="mt">Jewellery</h4>
          <p>Fashion Jewellery</p>
          <p>Fine Jewellery</p>
          <p>Earrings</p>

          <h4 className="mt">Backpacks</h4>

          <h4 className="mt">Handbags, Bags & Wallets</h4>

          <h4 className="mt">Luggages & Trolleys</h4>
        </div>

      </div>
    </div>
  );
};

export default Women;