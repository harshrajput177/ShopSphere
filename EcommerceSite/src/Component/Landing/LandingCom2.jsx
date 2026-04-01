import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../../Style-CSS/Landing-css/LandingCom2.css";

/* ── CARD ───────────────── */
function CategoryCard({ item }) {
  return (
    <div className="category-card">
      <div className="card-img-wrap">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
        />
      </div>
      <span className="card-label">{item.name}</span>
    </div>
  );
}

/* ── ROW ───────────────── */
function CategoryRow({ items }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="row-wrapper">
      <button className="scroll-btn left" onClick={() => scroll(-1)}>←</button>

      <div className="categories-row" ref={rowRef}>
        {items.map((item) => (
          <CategoryCard key={item._id} item={item} />
        ))}
      </div>

      <button className="scroll-btn right" onClick={() => scroll(1)}>→</button>
    </div>
  );
}

/* ── MAIN ───────────────── */
export default function CategoryGrid() {

  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/product-type");

        console.log("PRODUCT TYPES:", res.data);

        // ⚠️ depends on backend response
        setProductTypes(res.data.productTypes || res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProductTypes();
  }, []);

  return (
    <section className="category-section">

      <div className="section-header">
        <h2 className="section-title">
          Shop by <span>Product Type</span>
        </h2>
      </div>

      {/* 🔥 dynamic product types */}
      <CategoryRow items={productTypes} />

    </section>
  );
}