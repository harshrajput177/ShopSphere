import React, { useEffect, useState } from "react";
import "../../Style-CSS/ProductListing/ProductListing.css";
import FilterSidebar from "../ProductListing/FilterSlider";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductListing = () => {
  const { category } = useParams(); // URL se category aayegi

  const [sortType, setSortType] = useState("");
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

  /*
  Example URL:
  /products/cargo-pant

  category = cargo-pant
  */

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/products/type/${category}`
        );

        // console.log("Category Products ", res.data);

        setProducts(res.data);
        setOriginalProducts(res.data);
      } catch (error) {
        console.log("Fetch Error ", error);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category]);

  const handleSort = (type) => {
    setSortType(type);

    let sorted = [...originalProducts];

    if (type === "low") {
      sorted.sort((a, b) => a.price - b.price);
    }

    else if (type === "high") {
      sorted.sort((a, b) => b.price - a.price);
    }

    else if (type === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    else if (type === "latest") {
      sorted = [...originalProducts].reverse();
    }

    setProducts(sorted);
  };

  return (
    <div className="pl-container">

      {/* LEFT SIDE */}
      <div className="pl-left">

        {/* Breadcrumb */}
        <div className="pl-breadcrumb">
          Home / Products / {category?.replace(/-/g, " ")}
        </div>

        <FilterSidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="pl-products">

        {/* TOP BAR */}
        <div className="pl-topbar">
          <div>
            <h2>
              {category?.replace(/-/g, " ")} Products
            </h2>
          </div>

          <div className="pl-sort">
            <span>Sort by:</span>

            <select
              value={sortType}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Bestseller</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="pl-grid">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="pl-card" key={item._id}>

                <div className="pl-img-wrap">
                  <img
                    src={
                      item?.variants?.[0]?.mainImage ||
                      item?.variants?.[0]?.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.title}
                  />

                  <span className="pl-badge">
                    Best Price
                  </span>

                  <div className="pl-actions">
                    <button>🛒</button>
                    <button>♡</button>
                  </div>
                </div>

                <div className="pl-rating">
                  ⭐ {item.rating || 4.5}
                </div>

                <div className="pl-info">
                  <h4 className="pl-brand">
                    {item.brand || "Brand"}
                  </h4>

                  <p className="pl-title">
                    {item.title}
                  </p>

                  <div className="pl-price">
                 <span className="current">
  ₹{
    item?.variants?.[0]?.sizes?.[0]?.price ||
    item?.price ||
    0
  }
</span>

<span className="old">
  ₹{
    item?.oldPrice ||
    (
      (item?.variants?.[0]?.sizes?.[0]?.price || item?.price || 0)
      + 500
    )
  }
</span>

<span className="off">
  {item?.discount
    ? `${item.discount}% OFF`
    : "20% OFF"}
</span>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <h3>No Products Found</h3>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductListing;