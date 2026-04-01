import React, { useEffect, useState } from "react";
import "../../../Style-CSS/Landing-css/SearchMobileView/SearchMobile.css";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchMobile = ({ closeSearch }) => {

  const navigate = useNavigate();
  const [params] = useSearchParams();

  // 🔥 URL se query uthao
  const query = params.get("q") || "";

  const [searchText, setSearchText] = useState(query);

  // 🔥 jab URL change ho → input update ho
  useEffect(() => {
    setSearchText(query);
  }, [query]);

  // 🔥 Enter press → URL update
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      navigate(`/search?q=${searchText}`);
    }
  };

  return (
    <div className="Mobile-search-container">

      {/* HEADER */}
      <div className="Mobile-search-header">
        <FaArrowLeft
          className="Mobile-icon"
          onClick={closeSearch}
        />

        <div className="Mobile-search-box">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search for products, styles, brands"
            autoFocus
          />
          <FaCamera className="Mobile-camera-icon" />
        </div>
      </div>

      {/* 🔥 QUERY SHOW (for testing / results later) */}
      {query && (
        <div style={{ padding: "10px 15px", fontSize: "14px" }}>
          Showing results for: <b>{query}</b>
        </div>
      )}

      {/* RECENT SEARCHES */}
      <div className="Mobile-recent-section">
        <div className="Mobile-section-header">
          <h4>Recent Searches</h4>
          <FiTrash2 className="Mobile-delete-icon" />
        </div>

        <div className="Mobile-recent-tags">
          <span onClick={() => navigate("/search?q=Induction Cooktop")}>
            Induction Cooktop
          </span>
          <span onClick={() => navigate("/search?q=Induction stove")}>
            Induction stove
          </span>
          <span onClick={() => navigate("/search?q=Induction cookware")}>
            Induction cookware
          </span>
        </div>
      </div>

      {/* MOST VISITED */}
      <div className="Mobile-visited-section">
        <h4>Most Visited Stores</h4>

        <div className="Mobile-store-grid">

          <div
            className="Mobile-store-card"
            onClick={() => navigate("/search?q=summer")}
          >
            <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03" />
            <p>Summer Selects</p>
          </div>

          <div
            className="Mobile-store-card"
            onClick={() => navigate("/search?q=shaadi")}
          >
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8" />
            <p>Shaadi Sale</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SearchMobile;