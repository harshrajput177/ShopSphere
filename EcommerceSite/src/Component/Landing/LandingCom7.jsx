import React from "react";
import "../../Style-CSS/Landing-css/LandingCom7.css";
import { FaArrowRight } from "react-icons/fa";

const data = [
  {
    title: "All Dresses",
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"
  },
  {
    title: "Festive Wear",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"
  },
  {
    title: "Ankle Leggings",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
  },
  {
    title: "Churidar Leggings",
    img: "https://images.unsplash.com/photo-1520975922203-bdb9c2b3a6d4"
  },
  {
    title: "Resort Wear",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
  }
];

const CategoryCollection = () => {
  return (
    <div className="collection-section">

      <h2>More Collection to Explore</h2>

      <div className="collection-slider">

        {data.map((item, index) => (
          <div className="collection-card" key={index}>

            <div className="card-img">
              <img src={item.img} alt={item.title} />
            </div>

            <div className="card-bottom">
              <span  className="category-title">{item.title}</span>
              <FaArrowRight />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CategoryCollection;