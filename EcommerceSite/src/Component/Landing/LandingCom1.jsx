import React, { useState, useEffect, useCallback } from "react";
import "../../Style-CSS/Landing-css/LandingCom1.css";
import API from "../api/api";

/* ── Skeleton ──────────────────────────────────── */
function BannerSkeleton() {
  return (
    <div className="dual-banner-wrapper">
      <div className="dual-banner-container">
        <div className="dual-banner-track">
          <div className="dual-banner-slide skeleton-slide" />
          <div className="dual-banner-slide skeleton-slide" />
        </div>
      </div>
    </div>
  );
}

const BannerSlider = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ skeleton ke liye

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get("/api/banner");
        const formatted = res.data.banners.map((item) =>
          item.image.replace(/(\.\w+)\1$/, "$1")
        );
        setImages(formatted);
      } catch (err) {
        console.error("Banner fetch error:", err);
      } finally {
        setLoading(false); // ✅ error aaye tab bhi skeleton hatao
      }
    };

    fetchBanners();
  }, []);

  // ✅ useCallback — interval mein stale closure nahi banega
  const next = useCallback(() => {
    setIndex((prev) =>
      prev < images.length - 2 ? prev + 0.5 : 0
    );
  }, [images.length]);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, images.length]);

  // ✅ Skeleton dikhao jab tak data nahi aata
  if (loading) return <BannerSkeleton />;

  return (
    <div className="dual-banner-wrapper">
      <div className="dual-banner-container">
        <div
          className="dual-banner-track"
          style={{ transform: `translateX(-${index * 50}%)` }}
        >
          {images.map((img, i) => {
            const isActive =
              i === Math.floor(index) || i === Math.floor(index) + 1;

            return (
              <div
                key={i}
                className={`dual-banner-slide ${isActive ? "active" : ""}`}
              >
                {/* ✅ pehli 2 images eager, baaki lazy */}
                <img
                  src={img}
                  alt={`banner-${i + 1}`}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </div>
            );
          })}
        </div>

        <div className="dual-dots">
          {Array.from({ length: images.length - 1 }).map((_, i) => (
            <span
              key={i}
              className={`dot ${Math.floor(index) === i ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;