import React from "react";
import "../../Style-CSS/Landing-css/LandingCom8.css";

import heroImg  from "../../images/Blue simple fashion sale  (Banner (Landscape)).png";
import modelImg from "../../images/Beige and Brown Simple Fashion Collection Photo Collage Banner (1).png";

const SummerBanner = () => {
  return (
    <section className="summer-banner" aria-label="Summer Sale Banner">

      {/* ── BANNER 1: Left — Full Image ── */}
      <div className="summer-banner-left">
        <img src={heroImg} alt="Summer Sale" />
      </div>

      {/* ── BANNER 2: Right — Model Full BG with Text ── */}
      <div className="summer-banner-right">
        <img src={modelImg} alt="New Summer Collection" className="summer-right-bg" />
      </div>

    </section>
  );
};

export default SummerBanner;