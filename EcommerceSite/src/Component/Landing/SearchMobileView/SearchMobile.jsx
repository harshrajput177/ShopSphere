import React, { useEffect, useRef, useState } from "react";
import "../../../Style-CSS/Landing-css/SearchMobileView/SearchMobile.css";
import { FaArrowLeft } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/api";
import { CiSearch } from "react-icons/ci";
import { MdOutlineHistory, MdNorthWest } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

/* ─── Local Storage Helpers ───────────────── */
const RECENT_KEY = "recentSearches"; // Navbar ke saath same key

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

/* ─── Highlight matched text ──────────────── */
const Highlight = ({ text, query }) => {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <span>{text}</span>;
  return (
    <span>
      {text.substring(0, idx)}
      <em className="sugg-highlight">{text.substring(idx, idx + query.length)}</em>
      {text.substring(idx + query.length)}
    </span>
  );
};

const SearchMobile = ({ closeSearch }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const inputRef = useRef(null);

  const [searchText, setSearchText]       = useState(query);
  const [suggestions, setSuggestions]     = useState([]);
  const [trending, setTrending]           = useState([]);
  const [recentSearches, setRecentSearches] = useState(getRecent);
  const [showSugg, setShowSugg]           = useState(false);

  /* Autofocus */
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* Trending fetch */
  useEffect(() => {
    API.get("/api/products/search/trending")
      .then((res) => setTrending(res.data.trending || []))
      .catch(() => {});
  }, []);

  /* Suggestions API — debounced */
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

  /* Search Handler */
  const handleSearch = (q = searchText) => {
    const text = typeof q === "object" ? q.text || "" : String(q);
    const trimmed = text.trim();
    if (!trimmed) return;

    const updated = addToRecent(trimmed, recentSearches);
    setRecentSearches(updated);
    setShowSugg(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    closeSearch && closeSearch();
  };

  const deleteRecent = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter((r) => r !== item);
    setRecentSearches(updated);
    saveRecent(updated);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    saveRecent([]);
  };

  /* Suggestion groups */
  const keywordSugg  = suggestions.filter((s) => s.type === "keyword");
  const categorySugg = suggestions.filter((s) => s.type === "category");
  const productSugg  = suggestions.filter((s) => s.type === "product");

  /* ── Home State (recent + trending) ── */
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
              <button
                key={i}
                className="SM-tag"
                onClick={() => handleSearch(r)}
              >
                <MdOutlineHistory size={13} />
                {r}
                <span
                  className="SM-tag-delete"
                  onClick={(e) => deleteRecent(e, r)}
                >
                  <FaXmark size={9} />
                </span>
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
          {(trending.length > 0
            ? trending
            : [
                { text: "Women Straight Jeans" },
                { text: "Oversized T-Shirts" },
                { text: "Ethnic Wear Sale" },
                { text: "Summer Dresses" },
                { text: "Men Chinos" },
              ]
          ).map((t, i) => (
            <li
              key={i}
              className="SM-trend-item"
              onClick={() => handleSearch(t.text || t)}
            >
              <span className="SM-trend-num">{i + 1}</span>
              <span className="SM-trend-text">{t.text || t}</span>
              {i < 2 && <HiOutlineFire className="SM-fire-icon" />}
              <MdNorthWest className="SM-arr-icon" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  /* ── Suggestion List (typed query) ── */
  const SuggestionList = () => (
    <div className="SM-sugg-wrapper">

      {/* Keywords */}
      {keywordSugg.length > 0 && (
        <>
          <div className="SM-sugg-label">Suggestions</div>
          <ul className="SM-sugg-list">
            {keywordSugg.map((s, i) => (
              <li
                key={i}
                className="SM-sugg-item"
                onClick={() => handleSearch(s.text)}
              >
                <CiSearch className="SM-sugg-icon" />
                <span className="SM-sugg-text">
                  <Highlight text={s.text} query={searchText} />
                </span>
                {s.meta && <span className="SM-sugg-badge">{s.meta}</span>}
                <MdNorthWest className="SM-arr-icon" />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Categories */}
      {categorySugg.length > 0 && (
        <>
          <div className="SM-sugg-label">Categories</div>
          <ul className="SM-sugg-list">
            {categorySugg.map((s, i) => (
              <li
                key={i}
                className="SM-sugg-item SM-sugg-item--cat"
                onClick={() => handleSearch(s.text)}
              >
                <span className="SM-cat-icon">📂</span>
                <span className="SM-sugg-text">
                  <Highlight text={s.text} query={searchText} />
                </span>
                {s.meta && (
                  <span className="SM-sugg-badge SM-sugg-badge--gray">
                    {s.meta}
                  </span>
                )}
                <MdNorthWest className="SM-arr-icon" />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Products */}
      {productSugg.length > 0 && (
        <>
          <div className="SM-sugg-label">Products</div>
          <ul className="SM-sugg-list">
            {productSugg.map((s, i) => (
              <li
                key={i}
                className="SM-sugg-item SM-sugg-item--product"
                onClick={() => {
                  setShowSugg(false);
                  navigate(`/product/${s.id}`);
                  closeSearch && closeSearch();
                }}
              >
                <div className="SM-prod-thumb">
                  {s.image
                    ? <img src={s.image} alt={s.text} />
                    : <span>👕</span>}
                </div>
                <div className="SM-prod-info">
                  <span className="SM-prod-name">
                    <Highlight text={s.text} query={searchText} />
                  </span>
                  {s.meta && <span className="SM-prod-meta">{s.meta}</span>}
                </div>
                {s.price && <span className="SM-prod-price">{s.price}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
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
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search products, brands..."
          />
          {searchText && (
            <button
              className="SM-clear-input-btn"
              onClick={() => { setSearchText(""); setSuggestions([]); }}
            >
              <FaXmark size={9} />
            </button>
          )}
        </div>

        <button className="SM-search-btn" onClick={() => handleSearch()}>
          Search
        </button>
      </div>

      {/* Body */}
      <div className="SM-body">
        {showSugg && suggestions.length > 0
          ? <SuggestionList />
          : <HomeState />
        }
      </div>
    </div>
  );
};

export default SearchMobile;