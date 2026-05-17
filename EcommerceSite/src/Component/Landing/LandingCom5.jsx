import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "../../Style-CSS/Landing-css/LandingCom5.css";

export default function CoordSets() {
  const sliderRef = useRef();
  const navigate = useNavigate();

  const { data, loading } = useSelector((state) => state.productType);

  const coordSets = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => item.group === "Co-ord Set");
  }, [data]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <div className="co-wrap">

      {/* Header */}
      <div className="co-header">
        <div>
          <h2 className="co-title">
            Co-ord <span className="co-title-italic">Sets</span>
          </h2>
          <div className="co-title-underline" />
        </div>
        <div className="co-nav">
          <button className="co-btn" onClick={scrollLeft} aria-label="Scroll left">
            &#8592;
          </button>
          <button className="co-btn" onClick={scrollRight} aria-label="Scroll right">
            &#8594;
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="co-track" ref={sliderRef}>

        {/* Loading Skeletons */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div className="co-skeleton" key={i}>
              <div className="co-skel-img" />
              <div className="co-skel-line" style={{ width: "70%" }} />
              <div className="co-skel-line" style={{ width: "40%", marginTop: "6px", height: "11px" }} />
            </div>
          ))}

        {/* Cards */}
        {!loading &&
          coordSets.map((item) => (
            <div
              className="co-card"
              key={item._id}
              onClick={() => navigate(`/products/${item.slug}`)}
            >
              <div className="co-img-box">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_BASE_URL}/${item.image}`
                  }
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = "/images/default.jpg";
                  }}
                />
                <div className="co-overlay" />
                <div className="co-shop-tag">Shop Now</div>
              </div>

              <div className="co-info">
                <div className="co-info-left">
                  <p className="co-name">{item.name}</p>
                  <p className="co-sub">{item.tag || "New Arrival"}</p>
                </div>
                <div className="co-arrow">&#8594;</div>
              </div>
            </div>
          ))}

      </div>
    </div>
  );
}