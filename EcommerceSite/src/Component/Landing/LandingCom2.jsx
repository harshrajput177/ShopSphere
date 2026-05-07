import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style-CSS/Landing-css/LandingCom2.css";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function CategoryCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!item.slug) {
      console.error("Slug missing for:", item.name);
      return;
    }
    navigate(`/products/${item.slug}`);
  };

  return (
    <div
      className="category-card-com2"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-img-wrap-com2">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>

      <span className="card-label">{item.name}</span>
    </div>
  );
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);

  const firstRow = categories.slice(0, 14);
  const secondRow = categories.slice(16);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await API.get("/api/product-type");

        const productTypes = res.data.productTypes || res.data;

        // optional: limit if needed
        const limited = productTypes.slice(0, 26);

        // shuffle (optional)
        const shuffled = limited.sort(() => Math.random() - 0.5);

        setCategories(shuffled);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProductTypes();
  }, []);

  return (
    <section className="category-section">
      <div className="section-header">
        <h2 className="section-title">
          Shop by <span>Category</span>
        </h2>
      </div>

      <div className="row-wrapper">
        {/* FIRST ROW */}
        <div className="categories-row-com2">
          {firstRow.map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="categories-row-com2">
          {secondRow.map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}