import { useRef } from "react";
import "../../Style-CSS/Landing-css/LandingCom5.css";

const deals = [
  {
    id: 1,
    brand: "MVMT, Guess",
    discount: "Min. 50% Off",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
  },
  {
    id: 2,
    brand: "Abros & Action",
    discount: "Min. 65% Off",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
  },
  {
    id: 3,
    brand: "Kurta sets",
    discount: "Min. 75% Off",
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300"
  },
  {
    id: 4,
    brand: "Red Tape",
    discount: "Min. 83% Off",
    img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300"
  },
  {
    id: 5,
    brand: "Campus",
    discount: "Min. 50% Off",
    img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300"
  },

   {
    id: 6,
    brand: "Abros & Action",
    discount: "Min. 65% Off",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
  },
  {
    id: 7,
    brand: "Kurta sets",
    discount: "Min. 75% Off",
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300"
  },
  {
    id: 8,
    brand: "Red Tape",
    discount: "Min. 83% Off",
    img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300"
  },
  {
    id: 9,
    brand: "Campus",
    discount: "Min. 50% Off",
    img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300"
  }
];

export default function ClearanceOffers() {

  const sliderRef = useRef();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  };

  return (
    <div className="clearance-container-com5">

      <h2 className="title-com5">Clearance offers</h2>

      <button className="nav-btn-com5 left-com5" onClick={scrollLeft}>❮</button>

      <div className="card-slider-com5" ref={sliderRef}>

        {deals.map((item) => (
          <div className="deal-card-com5" key={item.id}>

            <div className="img-box-com5">
              <img src={item.img} alt="" />
            </div>

            <div className="card-info-com5">
              <p>{item.brand}</p>
              <h3>{item.discount}</h3>
            </div>

          </div>
        ))}

      </div>

      <button className="nav-btn-com5 right-com5" onClick={scrollRight}>❯</button>

    </div>
  );
}