import React, { useRef, useState, useEffect } from "react";
import "../../Style-CSS/Landing-css/LandingCom8.css";

import heroImg  from "../../images/Blue simple fashion sale  (Banner (Landscape)).png";
import modelImg from "../../images/Beige and Brown Simple Fashion Collection Photo Collage Banner (1).png";

const SLIDES = [
  { src: heroImg,  alt: "Summer Sale",            cls: "summer-banner-left"  },
  { src: modelImg, alt: "New Summer Collection",   cls: "summer-banner-right" },
];

const SummerBanner = () => {
  const trackRef   = useRef(null);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ── detect mobile ── */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── sync dot on scroll ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isMobile) return;

    const onScroll = () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      setActive(idx);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  /* ── dot click → scroll ── */
  const goTo = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
    setActive(idx);
  };

  return (
    <section className="summer-banner" aria-label="Summer Sale Banner">

      {/* ── SLIDER TRACK ── */}
      <div className="summer-slider-track" ref={trackRef}>
        {SLIDES.map((slide, i) => (
          <div key={i} className={`summer-slide ${slide.cls}`}>
            <img
              src={slide.src}
              alt={slide.alt}
              className={slide.cls === "summer-banner-right" ? "summer-right-bg" : ""}
            />
          </div>
        ))}
      </div>

      {/* ── DOTS — mobile only ── */}
      {isMobile && (
        <div className="summer-dots" role="tablist" aria-label="Slide navigation">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`summer-dot ${i === active ? "summer-dot--active" : ""}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default SummerBanner;