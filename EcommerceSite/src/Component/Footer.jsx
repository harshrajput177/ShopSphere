import React from "react";
import "../Style-CSS/Footer.css";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-top">

        {/* Column 1 */}
        <div className="footer-col">
          <h4>ONLINE SHOPPING</h4>
          <p>Men</p>
          <p>Women</p>
          <p>Kids</p>
          <p>Home</p>
          <p>Beauty</p>
          <p>Genz</p>
          <p>Gift Cards</p>
          <p>Myntra Insider</p>
        </div>

           <div className="footer-col">
          <h4>ONLINE SHOPPING</h4>
          <p>Men</p>
          <p>Women</p>
          <p>Kids</p>
          <p>Home</p>
          <p>Beauty</p>
          <p>Genz</p>
          <p>Gift Cards</p>
          <p>Myntra Insider</p>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>CUSTOMER POLICIES</h4>
          <p>Contact Us</p>
          <p>FAQ</p>
          <p>T&C</p>
          <p>Terms Of Use</p>
          <p>Track Orders</p>
          <p>Shipping</p>
          <p>Cancellation</p>
          <p>Privacy Policy</p>
          <p>Grievance Redressal</p>
        </div>

        {/* Column 3 */}
        <div className="footer-col  right-col-footer-view">
  <div className="footer-col right-col">
          <div className="guarantee">
            <img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" alt="original" />
            <p><strong>100% ORIGINAL</strong> guarantee for all products</p>
          </div>

          <div className="return">
            <img src="https://cdn-icons-png.flaticon.com/128/709/709496.png" alt="return" />
            <p><strong>Return within 14days</strong> of receiving your order</p>
          </div>
        </div>

        <div  className="right-footer-social-icon">
            <h5>KEEP IN TOUCH</h5>

          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>
        </div>

        {/* Column 4 */}
      

      </div>

      {/* Popular Searches */}
      <div className="footer-middle">
        <h4>POPULAR SEARCHES</h4>
        <p>
          Makeup | Dresses For Girls | T-Shirts | Sandals | Headphones | Babydolls |
          Blazers For Men | Handbags | Ladies Watches | Bags | Sport Shoes |
          Puma Shoes | Wallets | Tops | Earrings | Watches | Kurtis | Nike |
          Smart Watches | Titan Watches | Designer Blouse | Gowns | Rings |
          Jeans | Bikini | Myntra Fashion Show | Lipstick | Saree | Dresses
        </p>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>In case of any concern, <span>Contact Us</span></p>
        <p>© 2026 www.myntra.com. All rights reserved.</p>
        <p>A Flipkart company</p>
      </div>

    </footer>
  );
};

export default Footer;