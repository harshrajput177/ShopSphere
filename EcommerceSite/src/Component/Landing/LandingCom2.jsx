import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../../Style-CSS/Landing-css/LandingCom2.css";

/* ── CARD ───────────────── */
function CategoryCard({ item }) {
  return (
    <div className="category-card">
      <div className="card-img-wrap-com2">
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

// /* ── ROW ───────────────── */
// function CategoryRow({ items }) {
//   const rowRef = useRef(null);


//   return (
//     <div className="row-wrapper">
//       {/* <button className="scroll-btn left" onClick={() => scroll(-1)}>←</button> */}

//       <div className="categories-row-com2" ref={rowRef}>
//         {items.map((item) => (
//           <CategoryCard key={item._id} item={item} />
//         ))}
//       </div>

//     </div>
//   );
// }

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

        // 🔥 merge
        let merged = [
          ...subCategories.map(i => ({ ...i })),
          ...productTypes.map(i => ({ ...i }))
        ];

        // 🔥 shuffle (random order)
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