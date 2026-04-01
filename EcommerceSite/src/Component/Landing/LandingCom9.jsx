import React from "react";
import "../../Style-CSS/Landing-css/LandingCom9.css";

const data = [
  {
    title: "Mini bags & more",
    price: "Under ₹699",
    img: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
  },
  {
    title: "Short kurtis & more",
    price: "Under ₹699",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  },
  {
    title: "Mini-dial watches",
    price: "Min. 60% Off",
    img: "https://images.unsplash.com/photo-1523170335258-f5c6c6bd5d14",
  },
  {
    title: "Co-ords sets & more",
    price: "Min. 70% Off",
    img: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f",
  },
  {
    title: "Party dresses",
    price: "Under ₹999",
    img: "https://images.unsplash.com/photo-1520975922323-9d0e0b6a7c70",
  },
];

const GenZFashion = () => {
  return (
    <div className="genz-container">
      <h2 className="genz-title">Gen Z fashion</h2>

      <div className="genz-slider">
        {data.map((item, index) => (
          <div className="genz-card" key={index}>

            <img src={item.img} alt={item.title} />

            <div className="genz-info">
              <p>{item.title}</p>
            </div>

            <div className="genz-price">{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenZFashion;