import React from "react";
import "../../Style-CSS/ProductPage/SimilarProducts.css";

const products = [
  {
    id: 1,
    brand: "RANGMANCH BY PANTALOONS",
    title: "Embroidered Pure Cotton Kurti",
    price: 839,
    oldPrice: 1049,
    discount: "20% OFF",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"
  },
  {
    id: 2,
    brand: "Nayam By Lakshita",
    title: "Paisley Embroidered Kurti",
    price: 968,
    oldPrice: 2795,
    discount: "65% OFF",
    rating: 4.4,
    img: "https://images.unsplash.com/photo-1618354691373-d851d3d7a33a"
  },
  {
    id: 3,
    brand: "Sangria",
    title: "Cotton Embroidered Tunic",
    price: 899,
    oldPrice: 2249,
    discount: "60% OFF",
    rating: 3.8,
    img: "https://images.unsplash.com/photo-1593032465171-8c8c1b8c52d6"
  },
  {
    id: 4,
    brand: "Nayam By Lakshita",
    title: "Embroidered Embellished Kurti",
    price: 924,
    oldPrice: 2495,
    discount: "63% OFF",
    rating: 4.3,
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
  },
  {
    id: 5,
    brand: "Janasya",
    title: "Women Printed A-Line Tunic",
    price: 599,
    oldPrice: 1999,
    discount: "70% OFF",
    rating: 4.2,
    img: "https://images.unsplash.com/photo-1520975922324-5f3c7c8d84d0"
  },
  {
    id: 6,
    brand: "Bitterlime",
    title: "Printed Cotton Tunic",
    price: 563,
    oldPrice: 1999,
    discount: "72% OFF",
    rating: 4.1,
    img: "https://images.unsplash.com/photo-1503342452485-86d58b3a1d3f"
  },
  {
    id: 7,
    brand: "Bitterlime",
    title: "Mandarin Collar Checked Shirt",
    price: 749,
    oldPrice: 2499,
    discount: "70% OFF",
    rating: 3.8,
    img: "https://images.unsplash.com/photo-1520974735194-7a3f5a7d4c3b"
  }
];

const SimilarProducts = () => {
  return (
    <div className="similar-container">
      <h2 className="similar-title">You May Also Like</h2>

      <div className="similar-grid">
        {products.map((item) => (
          <div className="similar-product-card" key={item.id}>
            
            <div className="img-box">
              <img src={item.img} alt={item.title} />

              <div className="rating-badge">
                {item.rating} ★
              </div>
            </div>

            <div className="product-info">
              <h4 className="similar-product-brand">{item.brand}</h4>
              <p className="similar-product-title">{item.title}</p>

              <div className="price-row">
                <span className="similar-product-price">Rs. {item.price}</span>
                <span className="similar-product-old-price">Rs. {item.oldPrice}</span>
                <span className="similar-product-discount">({item.discount})</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;