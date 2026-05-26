import React, { useEffect, useRef, useState } from "react";
import "../../../Style-CSS/Landing-css/SearchMobileView/SearchMobile.css";
import { FaArrowLeft } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/api";
import { CiSearch } from "react-icons/ci";
import { MdOutlineHistory, MdNorthWest } from "react-icons/md";

/* ─── Trending fallback ─────────────────── */
const TRENDING = [
  "Women Straight Jeans",
  "Oversized T-Shirts",
  "Ethnic Wear Sale",
  "Summer Dresses",
  "Men Chinos",
];

/* ─── Local Storage Helpers ───────────────── */
const RECENT_KEY = "sm_recent_searches";

const getRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveRecent = (list) => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
};

const addToRecent = (q, current) => {
  const trimmed = q.trim();
  if (!trimmed) return current;
  const updated = [trimmed, ...current.filter((x) => x !== trimmed)].slice(0, 8);
  saveRecent(updated);
  return updated;
};

/* Highlight text */
const Highlight = ({ text, query }) => {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <span>{text}</span>;

  return (
    <span>
      {text.substring(0, idx)}
      <em className="sugg-highlight">
        {text.substring(idx, idx + query.length)}
      </em>
      {text.substring(idx + query.length)}
    </span>
  );
};

const SearchMobile = ({ closeSearch }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(getRecent);
  const [showSugg, setShowSugg] = useState(false);

  /* Autofocus */
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* Suggestions API */
  useEffect(() => {
    if (searchText.length < 2) {
      setSuggestions([]);
      setShowSugg(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await API.get(
          `/api/products/search/suggest?q=${encodeURIComponent(searchText)}`
        );
        setSuggestions(res.data.suggestions || []);
        setShowSugg(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  /* Search Handler → Redirect */
  const handleSearch = (q = searchText) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    const updated = addToRecent(trimmed, recentSearches);
    setRecentSearches(updated);

    setShowSugg(false);

    // ✅ MAIN FIX: Redirect to Product Listing
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);

    closeSearch && closeSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggClick = (s) => {
    handleSearch(s);
  };

  const handleRecentClick = (q) => {
    handleSearch(q);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    saveRecent([]);
  };

  /* Home UI */
  const HomeState = () => (
    <>
      {recentSearches.length > 0 && (
        <section className="SM-section">
          <div className="SM-section-header">
            <h4>Recent Searches</h4>
            <button className="SM-clear-btn" onClick={clearRecent}>
              <FiTrash2 size={13} /> Clear all
            </button>
          </div>

          <div className="SM-tags">
            {recentSearches.map((r, i) => (
              <button key={i} className="SM-tag" onClick={() => handleRecentClick(r)}>
                <MdOutlineHistory size={13} /> {r}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="SM-section">
        <div className="SM-section-header">
          <h4>Trending Now</h4>
        </div>

        <ul className="SM-trending-list">
          {TRENDING.map((t, i) => (
            <li key={i} className="SM-trend-item" onClick={() => handleRecentClick(t)}>
              <span className="SM-trend-num">{i + 1}</span>
              <span className="SM-trend-text">{t}</span>
              {i < 2 && <HiOutlineFire className="SM-fire-icon" />}
              <MdNorthWest className="SM-arr-icon" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  /* Suggestions UI */
  const SuggestionList = () => (
    <ul className="SM-sugg-list">
      {suggestions.map((s, i) => (
        <li key={i} className="SM-sugg-item" onClick={() => handleSuggClick(s)}>
          <CiSearch className="SM-sugg-icon" />
          <span className="SM-sugg-text">
            <Highlight text={s} query={searchText} />
          </span>
          <MdNorthWest className="SM-arr-icon" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="SM-container">
      {/* Header */}
      <div className="SM-header">
        <button className="SM-back-btn" onClick={closeSearch}>
          <FaArrowLeft size={16} />
        </button>

        <div className="SM-input-wrap">
          <CiSearch className="SM-input-icon" />

          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands..."
          />

          {searchText && (
            <button
              className="SM-clear-input-btn"
              onClick={() => setSearchText("")}
            >
              ✕
            </button>
          )}
        </div>

        <button className="SM-search-btn" onClick={() => handleSearch()}>
          Search
        </button>
      </div>

      {/* Body */}
      <div className="SM-body">
        {showSugg && suggestions.length > 0 ? (
          <SuggestionList />
        ) : (
          <HomeState />
        )}
      </div>
    </div>
  );
};

export default SearchMobile;
