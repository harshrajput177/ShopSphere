import React, { useState, useEffect } from "react";
import "../../Style-CSS/Landing-css/LandingCom1.css";

const BannerSlider = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/banner");
        const data = await res.json();

        const formatted = data.banners.map((item) => item.image);
        setImages(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBanners();
  }, []);

  const next = () => {
    if (index < images.length - 2) {
      setIndex(index + 0.5);
    } else {
      setIndex(0);
    }
  };



  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images, index]);

  return (
 <div className="dual-banner-wrapper">
  <div className="dual-banner-container">

    <div
      className="dual-banner-track"
      style={{
        transform: `translateX(-${index * 50}%)`,
      }}
    >
   {images.map((img, i) => {
  const isActive =
    i === Math.floor(index) || i === Math.floor(index) + 1;

  return (
    <div
      className={
        isActive
          ? "dual-banner-slide active"
          : "dual-banner-slide"
      }
      key={i}
    >
      <img src={img} alt="banner" />
    </div>
  );
})}
    </div>

    <div className="dual-dots">
  {Array.from({ length: images.length - 1 }).map((_, i) => (
    <span
      key={i}
      className={`dot ${
        Math.floor(index) === i ? "active" : ""
      }`}
      onClick={() => setIndex(i)}
    ></span>
  ))}
</div>

  </div>
</div>
  );
};

export default BannerSlider;