import React, { useState, useEffect } from "react";
import { useFilter } from "../../Component/Context-API/Fillter-Context";
import "../../Style-CSS/BestSeller-css/BestSellerProduct.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { colors } from "../BestSeller/ColorSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../ContextApiCart/LoginContextApi";
import { useProduct } from "../../ContextApiCart/ProductContextApi";
import Loader from "../../Pages/LoaderFullpage";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from "../../ContextApiCart/CartContextApi";
import { useWishlist } from "../ContextHook/WishlistHook";
import { useModal } from '../ModelContext/ModelContext';
import emptyImg from '../../images/15052214-removebg-preview.png';
const PRODUCTS_PER_PAGE = 6;

export default function ProductList({
  queryParam = "isBestseller=true",

}) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist } = useWishlist();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
const isInWishlist = (productId) =>
  wishlist?.some((item) => item.productId?._id === productId);


   const {
      showB2UModal, setShowB2UModal,
      showLoginModal, setShowLoginModal,
      showAuthModal, setShowAuthModal
    } = useModal();

  const { selected } = useFilter();
  const navigate = useNavigate();
  const {selectedProduct, setSelectedProduct } = useProduct();
   const { user, loadingUser } = useAuth();
   const { fetchCart } = useCart();

  const userId = user?._id;

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // console.log("Logged in user:", user);
  // console.log("User ID:", userId);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // ✅ show loading

        let query = "?";
        if (queryParam.includes("isBestseller=true")) query += "isBestseller=true&";
        if (queryParam.includes("ishumstore=true")) query += "isIshumStore=true&";
        if (queryParam.includes("ishumexclusive=true")) query += "isExclusive=true&";

        if (selected.collection) query += `collectionName=${selected.collection}&`;
        if (selected.size) query += `size=${selected.size}&`;
        if (selected.color) {
          const colorHex = colors.find((c) => c.name === selected.color)?.hex;
          query += `color=${colorHex}&`;
        }
        if (selected.category) query += `category=${selected.category}&`;
        if (selected.subcategory) query += `subcategory=${selected.subcategory}&`;
        if (selected.tag) query += `tag=${selected.tag}&`;
        if (selected.availability) query += `availability=${selected.availability === "InStock"}&`;

        if (query.endsWith("&")) query = query.slice(0, -1);

        const res = await axios.get(`${baseURL}/api/products/get-product${query}`);
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false); // ✅ hide loading
      }
    };

    fetchProducts();
  }, [queryParam, selected]);


  const handleBuyNow = async (product) => {
  if (user === undefined) {
    toast.info("Please wait...");
    return;
  }

  if (!user || !user._id) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setShowAuthModal(true);
    } else {
      setShowB2UModal(true);
    }
    return;
  }

  try {
    await axios.post(`${baseURL}/api/cart/addtocart`, {
      userId: user._id,
      productId: product._id,
      quantity: 1,
      size: product.size[0], // assuming first size
      color: product.color,
    });
    await fetchCart();
    navigate("/shipping");
  } catch (err) {
    console.error("Error in Buy Now:", err);
    toast.error("Something went wrong!");
  }
};


 const handleProductClick = (product, e) => {
      e.preventDefault();
    const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const updatedProduct = { ...product, slug };
    setSelectedProduct(updatedProduct);
    localStorage.setItem("selectedProduct", JSON.stringify(updatedProduct));
    navigate(`/viewproduct/${product.slug}`);
  };

  let filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const sizeMatch = selected.size ? product.size.includes(selected.size) : true;
        const tagMatch = selected.tag ? product.tag === selected.tag : true;
        const categoryMatch = selected.category ? product.category === selected.category : true;
        const subcategoryMatch = selected.subcategory ? product.subcategory === selected.subcategory : true;
        const colorHex = colors.find((c) => c.name === selected.color)?.hex;
        const colorMatch = selected.color ? product.color === colorHex : true;
        const availableMatch = selected.availability
          ? product.availability === (selected.availability === "InStock")
          : true;
        const collectionMatch = selected.collection
          ? product.collectionName?.title
              ?.toLowerCase()
              .replace(/\s+/g, "")
              .includes(selected.collection.toLowerCase().replace(/\s+/g, "").split(" ")[0])
          : true;
          const priceMatch = selected.price ? product.price <= selected.price : true;

        return sizeMatch && tagMatch && categoryMatch && subcategoryMatch && colorMatch && availableMatch && collectionMatch && priceMatch;
      })
    : [];


if (selected.sortRange) {
  const [min, max] = selected.sortRange.split("to").map((val) => Number(val.trim()));
  filteredProducts = filteredProducts
    .filter((product) => product.price >= min && product.price <= max)
    .sort((a, b) => a.price - b.price); // ✅ low to high sort
}


  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

 const handleAddToCart = async (product) => {
  if (loadingUser) {
 toast.info("Please wait, loading your ID..");

    return;
  }
 

  
  if (!user?._id) {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      setShowAuthModal(true);  
    } else {
      setShowB2UModal(true);   
    }

    return;
  }

    try {
      await axios.post(`${baseURL}/api/cart/addtocart`, {
        userId,
        productId: product._id,
        quantity: 1,
        size: product.size[0],
        color: product.color,
      });

         await fetchCart();
       toast.info("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div>
   {loading ? (
  <Loader />
) : (
  <>
    {displayedProducts.length === 0 ? (
      <div className="empty-product-wrapper">
        <img src={emptyImg} alt="No products found" className="empty-product-img" />
        <p className="empty-product-message">No products found.</p>
      </div>
    ) : (
      <>
          <div className="bestsellers-products-grid">
            {displayedProducts.map((product ,index) => (
              <div
                key={product._id}
                className="bestsellers-product-cards"
                onClick={(e) => handleProductClick(product, e)}
                 onMouseEnter={() => setHoveredIndex(index)}
                 onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
  className="bestsellers-product-image"
  loading="lazy"
  src={
    hoveredIndex === index &&
    product.thumbnails &&
    product.thumbnails.length > 1
      ? `${baseURL}/uploads/${
          product.thumbnails[1] || product.thumbnails[2] || product.thumbnails[3] || product.thumbnails[0]
        }`
      : `${baseURL}/uploads/${product.image}`
  }
  alt={product.name}
  onError={(e) => (e.target.src = "/fallback-image.png")}
/>
          

                    <div className="top-Products-hover-icons">
   <FavoriteBorderIcon
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(product);
  }}
  style={{
    cursor: "pointer",
    color: isInWishlist(product._id) ? "red" : "black", // ✅ Only icon fill will be red
    transition: "color 0.2s ease",
  }}
/>


                    <VisibilityIcon   />
                  </div>

                <div className="bestsellers-product-details">
                  <h3 className="bestsellers-product-name">{product.name}</h3>
                  <div className="Bestsell-Original-Discount-Price">
                  
                    <p className="bestsellers-product-price">₹{product.price}</p>
                  </div>
                  <div className="Product-LocalMall-Buy-Now-button">
   <LocalMallIcon
  className="LocalMallIcon"
  onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(product);
  }}
/>

<button
  className="bestsellers-buy-button"
  onClick={(e) => {
    e.stopPropagation();
    handleBuyNow(product);
  }}
>
  Buy Now
</button>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>

            {(() => {
              const pages = [];
              const siblingCount = 1;
              const totalNumbers = siblingCount * 2 + 3;
              const totalBlocks = totalNumbers + 2;

              const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
              const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

              const showLeftDots = leftSiblingIndex > 2;
              const showRightDots = rightSiblingIndex < totalPages - 1;

              pages.push(
                <button
                  key={1}
                  className={currentPage === 1 ? "active" : ""}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              );

              if (showLeftDots) {
                pages.push(<span key="left-dots">...</span>);
              }

              for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                pages.push(
                  <button
                    key={i}
                    className={currentPage === i ? "active" : ""}
                    onClick={() => handlePageChange(i)}
                  >
                    {i}
                  </button>
                );
              }

              if (showRightDots) {
                pages.push(<span key="right-dots">...</span>);
              }

              if (totalPages > 1) {
                pages.push(
                  <button
                    key={totalPages}
                    className={currentPage === totalPages ? "active" : ""}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

     </>
    )}
             <ToastContainer position="top-right" autoClose={3000} />
             
        </>
      )}


  
    </div>
  );
}

