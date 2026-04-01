import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "../../Style-CSS/SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../ContextApiCart/ProductContextApi";


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const suggestions = [
    "anarkali",
    "yellow viscose anarkali",
    "coffee brown viscose anarkali",
    "peacock blue viscose anarkali",
  ];

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setShowDropdown(inputValue.trim().length > 0);
  };

  
const handleProductClick = (product) => {
  // slug generate kar rahe hain name/title se
  const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // dropdown hide karo
  setShowDropdown(false);

  // store + navigate
  const updatedProduct = { ...product, slug }; // agar baad me slug chahiye toh object me daal do
  setSelectedProduct(updatedProduct);
  localStorage.setItem("selectedProduct", JSON.stringify(updatedProduct));

  navigate(`/viewproduct/${slug}`);
};



  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        axios.get(`${baseURL}/api/products/search?q=${query}`)

          .then((res) => {
            if (Array.isArray(res.data)) {
              setResults(res.data);
            } else if (Array.isArray(res.data.products)) {
              setResults(res.data.products);
            } else {
              console.error("Unexpected response format:", res.data);
              setResults([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching products:", err);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="Ishum-nav-search-wrapper">
      <input
        type="text"
        placeholder="Search"
        className="Ishum-nav-search-input"
        value={query}
        onChange={handleInputChange}
      />
      <SearchIcon className="Ishum-nav-search-icon" />

      {showDropdown && (
        <div className="search-dropdown">
          <div className="suggestions-section">
            <strong>SUGGESTIONS</strong>
            {filteredSuggestions.map((suggestion, idx) => (
              <div key={idx} className="suggestion-item">
                {suggestion}
              </div>
            ))}
          </div>

          <div className="products-section">
            <strong>PRODUCTS</strong>
            {results.length === 0 ? (
              <div className="no-results">No matching products</div>
            ) : (
              results.map((product, idx) => (
                <div
                key={idx}
                className="product-result"
                onClick={() => {
                  setSelectedProduct(product); // store in context
                  localStorage.setItem("selectedProduct", JSON.stringify(product)); // store in localStorage
                  handleProductClick(product);
                }}
              >
               <img src={`${baseURL}/uploads/${product.image}`} alt={product.name} />

                <div className="product-result-details">
                  <div>{product.name}</div>
                  <div>Rs. {product.price}</div>
                </div>
              </div>
              
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

