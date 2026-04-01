import React from "react";
import "../../Style-CSS/Landing-css/LandingCom10.css";
import { FaArrowRight } from "react-icons/fa";

const data = [
  {
    id: 1,
    title: "Footwear",
    image: "/images/offer1.png",
    offer: "",
  },
  {
    id: 2,
    title: "PUMA, ADIDAS...",
    image: "/images/offer2.png",
    offer: "Min. 65% Off",
  },
  {
    id: 3,
    title: "USPA & more",
    image: "/images/offer3.png",
    offer: "Min. 40% Off",
  },
  {
    id: 4,
    title: "PUMA, Skechers...",
    image: "/images/offer4.png",
    offer: "Min. 65% Off",
  },
  {
    id: 5,
    title: "ASICS, Sparx...",
    image: "/images/offer5.png",
    offer: "Min. 55% Off",
  },
];

const FootwearOffers = () => {
  return (
    <div className="offers-container-Com10">
      <h2 className="offers-title-Com10">Offers on footwear</h2>

      <div className="offers-slider-Com10">
        {data.map((item) => (
          <div className="offer-card-Com10" key={item.id}>
            <div className="offer-image-Com10">
              <img src={item.image} alt={item.title} />
              {item.id === 1 && (
                <button className="arrow-btn-Com10">
                  <FaArrowRight />
                </button>
              )}
            </div>

            {item.offer && (
              <div className="offer-badge-Com10">{item.offer}</div>
            )}

            <p className="offer-title-Com10">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootwearOffers;