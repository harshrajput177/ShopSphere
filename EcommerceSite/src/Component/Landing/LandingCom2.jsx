import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../../Style-CSS/Landing-css/LandingCom2.css";

import { useNavigate } from "react-router-dom";

function CategoryCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = item.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    navigate(`/products/${slug}`);
  };

  return (
    <div
      className="category-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-img-wrap-com2">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
        />
      </div>

      <span className="card-label">
        {item.name}
      </span>
    </div>
  );
}

export default function CategoryGrid() {

  const [categories, setCategories] = useState([]);

    const firstRow = categories.slice(0, 13);
const secondRow = categories.slice(13);

useEffect(() => {
  const fetchAll = async () => {
    try {
      const [ptRes, subRes] = await Promise.all([
        axios.get("http://localhost:4000/api/product-type"),
        axios.get("http://localhost:4000/api/subcategory")
      ]);

      const productTypes = ptRes.data.productTypes || ptRes.data;
      const subCategories = subRes.data.subCategories || subRes.data;

      // 🔥 only 12 productTypes
      const limitedProductTypes = productTypes.slice(0, 15);

      // 🔥 merge
      let merged = [
        ...subCategories,
        ...limitedProductTypes
      ];

      // 🔥 shuffle
      merged = merged.sort(() => Math.random() - 0.5);

      setCategories(merged);

    } catch (err) {
      console.log(err);
    }
  };

  fetchAll();
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