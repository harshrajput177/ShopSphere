import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../../Style-CSS/Navbar-css/MegaMenu.css";

const MegaMenu = ({ genderName, genderId, onEnter, onLeave }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [activeSubCat, setActiveSubCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const leaveTimer = useRef(null);

  useEffect(() => {
    if (!genderId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subRes, ptRes] = await Promise.all([
          API.get(`/api/subcategory/gender/${genderId}`),
          API.get(`/api/product-type?gender=${genderName}`),
        ]);
        const subs = subRes.data.subCategories || [];
        const pts  = ptRes.data.productTypes   || [];
        setSubCategories(subs);
        setProductTypes(pts);
        if (subs.length > 0) setActiveSubCat(subs[0]);
      } catch (err) {
        console.error("MegaMenu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [genderId, genderName]);

  const groupedTypes = useMemo(() => {
    if (!activeSubCat) return {};
    const filtered = productTypes.filter(
      (pt) => (pt.subCategory?._id ?? pt.subCategory) === activeSubCat._id
    );
    const map = {};
    filtered.forEach((pt) => {
      const g = pt.group || "Others";
      if (!map[g]) map[g] = [];
      map[g].push({ id: pt._id, name: pt.name, slug: pt.slug });
    });
    return map;
  }, [activeSubCat, productTypes]);

  const handleItemClick = (pt) => {
    const path = pt.slug
      ? `/${genderName.toLowerCase()}/${pt.slug}`
      : `/${genderName.toLowerCase()}?subCategory=${activeSubCat._id}&productType=${pt.id}`;
    navigate(path);
  };

  // Stable hover — cancel leave on re-enter
  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    onEnter();
  };
  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => onLeave(), 120);
  };

  return (
    <div
      className="mega-menu-f"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mega-layout">

        {/* LEFT — SubCategory tabs */}
        <div className="mega-left">
          {loading
            ? [...Array(5)].map((_, i) => <div key={i} className="mega-tab-skeleton" />)
            : subCategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`mega-tab ${activeSubCat?._id === sub._id ? "mega-tab--active" : ""}`}
                  onMouseEnter={() => setActiveSubCat(sub)}
                  onClick={() => navigate(`/${genderName.toLowerCase()}?subCategory=${sub._id}`)}
                >
                  {sub.name}
                </div>
              ))
          }
        </div>

        {/* RIGHT — grouped product types */}
        <div className="mega-right">
          {loading ? (
            <div className="mega-right-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mega-right-skeleton-col">
                  <div className="skeleton-heading" />
                  {[...Array(5)].map((_, j) => <div key={j} className="skeleton-item" />)}
                </div>
              ))}
            </div>
          ) : Object.keys(groupedTypes).length === 0 ? (
            <p className="mega-empty">No items found</p>
          ) : (
            <div className="mega-groups-grid">
              {Object.entries(groupedTypes).map(([groupName, types]) => (
                <div key={groupName} className="mega-group-col">
                  <h4
                    className="mega-group-heading"
                    onClick={() =>
                      navigate(`/${genderName.toLowerCase()}?subCategory=${activeSubCat._id}&group=${encodeURIComponent(groupName)}`)
                    }
                  >
                    {groupName}
                  </h4>
                  {types.map((pt) => (
                    <p key={pt.id} className="mega-pt-item" onClick={() => handleItemClick(pt)}>
                      {pt.name}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MegaMenu;