import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../Store/Slices/ProductSlice"; // apna path daalo
import { FaArrowRight } from "react-icons/fa";
import "../../Style-CSS/Landing-css/LandingCom7.css";

function CollectionSkeleton() {
  return (
    <div className="collection-slider">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="collection-card skeleton-card" />
      ))}
    </div>
  );
}

const getSingleProductPerOccasion = (products) => {
  const map = {};
  const blockedOccasions = ["wedding", "office"];

  products.forEach((product) => {
    const mainImage = product?.variants?.[0]?.mainImage;
    product.occasion?.forEach((occ) => {
      if (!occ) return;
      if (blockedOccasions.includes(occ.toLowerCase())) return;
      if (!map[occ] && mainImage) {
        map[occ] = { product, mainImage };
      }
    });
  });

  return Object.entries(map).map(([occasion, data]) => ({
    title: occasion,
    image: data.mainImage,
    occasion,
  }));
};

const CategoryCollection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allItems: allProducts, loading, error } = useSelector(state => state.products);
  const [occasionData, setOccasionData] = useState([]);

  useEffect(() => {
    if (!allProducts.length) dispatch(fetchAllProducts()); // cache check slice mein already hai
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;
    const products = Array.isArray(allProducts) ? allProducts : [];
    setOccasionData(getSingleProductPerOccasion(products));
  }, [allProducts]);

  return (
    <div className="collection-section">
      <div className="collection-header">
        <h2>Shop by <em>Occasion</em></h2>
      </div>

      {loading && <CollectionSkeleton />}


      {!loading && !error && (
        <div className="collection-slider">
          {occasionData.map((item, index) => (
            <div
              className="collection-card"
              key={item.title || index}
              onClick={() => navigate(`/occasion/${item.occasion}`)}
            >
              <div className="card-img">
                <img
                  src={item.image || "/images/default.jpg"}
                  alt={item.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  width="300"
                  height="380"
                />
              </div>
              <div className="card-bottom">
                <span className="category-title">{item.title}</span>
                <FaArrowRight className="card-arrow" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCollection;