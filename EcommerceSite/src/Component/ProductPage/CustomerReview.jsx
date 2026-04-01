import React from "react";
import "../../Style-CSS/ProductPage/CustomerReview.css";

const reviews = [
  {
    id: 1,
    title: "His favorite shirts!",
    color: "Black",
    size: "XL",
    date: "08 August 2023",
    text: "They are scoundrels, do not buy this garbage...",
    likes: 22,
    dislikes: 0,
  },
  {
    id: 2,
    title: "Cool as a cucumber",
    color: "Gray",
    size: "L",
    date: "12 July 2023",
    text: "This shirt is made of polyester and I wasn’t sure...",
    likes: 34,
    dislikes: 0,
  },
  {
    id: 3,
    title: "My Son inLaw likes these shirts",
    color: "Black",
    size: "2XL",
    date: "12 July 2023",
    text: "Perfect shirt for summer, light weight...",
    likes: 21,
    dislikes: 0,
  },
  {
    id: 4,
    title: "Best comfortable polo shirt",
    color: "Black",
    size: "2XL",
    date: "08 Jun 2023",
    text: "Best comfortable and practical polo shirts...",
    likes: 18,
    dislikes: 1,
  },
];

const CustomerReviews = () => {
  return (
    <div className="Customer-reviews-container">
      <h2>Customer Reviews</h2>

      {/* Top Summary */}
      <div className="Customer-reviews-summary">
        <div className="Customer-rating-circle">
          <h1>4.8</h1>
        </div>

        <div className="Customer-rating-info">
          <div className="Customer-stars">★★★★★</div>
          <p>95% of buyers are satisfied</p>
          <span>98 rating • 125 Reviews</span>
        </div>

        <div className="Customer-rating-bars">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div key={i} className="bar-row">
              <span>{star} ★</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{ width: `${80 - i * 15}%` }}
                ></div>
              </div>
              <span>{[136, 33, 9, 10, 2][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className="Customer-reviews-grid">
        {reviews.map((item) => (
          <div key={item.id} className="Customer-review-card">
            <div className="Customer-card-header">
              <div className="Customer-stars">★★★★★</div>
              <span className="customer-review-date">{item.date}</span>
            </div>

            <h4>{item.title}</h4>
            <p className="meta">
              Color : {item.color} • Size : {item.size}
            </p>

            <p className="review-text">{item.text}</p>

            <div className="actions">
              <span>👍 {item.likes}</span>
              <span>👎 {item.dislikes}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="Customer-review-view-all-btn">See All Reviews</button>
    </div>
  );
};

export default CustomerReviews;