import React, { useState } from "react";
import "../../Style-CSS/Landing-css/LandingCom1.css";

const images = [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
  "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1600",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600",

];

const BannerSlider = () => {

  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
  <div className="lanCom1-banner-wrapper">

    <div className="lanCom1-banner">

      <button className="lanCom1-arrow lanCom1-left" onClick={prev}>❮</button>

      <img src={images[index]} alt="banner" />

      <button className="lanCom1-arrow lanCom1-right" onClick={next}>❯</button>

      <div className="lanCom1-dots">
        {images.map((_,i)=>(
          <span
            key={i}
            className={index===i ? "lanCom1-dot lanCom1-active" : "lanCom1-dot"}
          ></span>
        ))}
      </div>

    </div>

  </div>

  );
};

export default BannerSlider;