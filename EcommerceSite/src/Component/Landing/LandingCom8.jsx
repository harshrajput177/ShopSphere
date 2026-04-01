
import React from "react";
import "../../Style-CSS/Landing-css/LandingCom8.css";
import imagbanner from "../../images/360_F_320686681_Ur6vdYQgDC9WiijiVfxlRyQffxOgfeFz.jpg"
import imgbanner2 from "../../images/96d406f8-b29f-4497-8ce3-83f967bcce4b.__CR0,0,600,450_PT0_SX600_V1___.jpg"
const SummerBanner = () => {
  return (
    <div className="summer-banner">

      {/* LEFT BANNER */}
      <div className="summer-banner-left">
        <img
          src={imagbanner}
          alt="summer"
        />

        <div className="summer-circle-offer">
     <p>LIMITED TIME OFFER</p>
<h2>SUMMER</h2>
<h1>SALE</h1>

          <button>SHOP NOW</button>
        </div>
      </div>

      {/* RIGHT BANNER */}
      <div className="summer-banner-right">
        <div className="summer-banner-content">
          <p>SALE UP TO 50% OFF</p>

          <h1>
            NEW SUMMER <br /> COLLECTION
          </h1>

          <button>SHOP NOW</button>
        </div>

        <img
          src={imgbanner2}
          alt="collection"
        />
      </div>

    </div>
  );
};

export default SummerBanner;