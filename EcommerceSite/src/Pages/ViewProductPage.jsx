import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import "../Style-CSS/Pages/ViewProductPage.css";
import Comp1 from "../Component/ProductPage/ViewProduct";
import Comp3 from "../Component/ProductPage/SimilarProduct";
import Comp4 from "../Component/ProductPage/RecentViewProduct";
import Comp5 from "../Component/ProductPage/YouMayAlso";


function ProductPageSkeleton() {
  return (
    <div className="ViewProduct-product-container">

      {/* Left — Image Section */}
      <div className="ViewProduct-image-section">
        <div className="thumbnail-list">
          <div className="thumbnail-scroll">
            {[1,2,3,4].map(i => (
              <div key={i} className="sk sk-thumb" />
            ))}
          </div>
        </div>
        <div className="sk sk-main-image" />
      </div>

      {/* Right — Details Section */}
      <div className="ViewProduct-details-section">

        <div className="sk sk-brand" />
        <div className="sk sk-title-lg" />
        <div className="sk sk-title-sm" />
        <div className="sk sk-rating" />

        {/* Price row */}
        <div className="sk-price-row">
          <div className="sk sk-price-main" />
          <div className="sk sk-price-old" />
          <div className="sk sk-price-badge" />
        </div>

        <div className="sk sk-label" />

        {/* Color swatches */}
        <div className="sk-colors">
          {[1,2,3].map(i => (
            <div key={i} className="sk sk-color-swatch" />
          ))}
        </div>

        <div className="sk sk-label" />

        {/* Sizes */}
        <div className="sk-sizes">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="sk sk-size-btn" />
          ))}
        </div>

        {/* Buttons */}
        <div className="sk-btns">
          <div className="sk sk-wish-btn" />
          <div className="sk sk-cart-btn" />
        </div>

        {/* Delivery box */}
        <div className="sk sk-delivery" />

        {/* Accordion heading */}
        <div className="sk sk-acc-heading" />

        {/* Accordion rows */}
        <div className="sk-acc-group">
          {[130, 110, 100].map((w, i) => (
            <div key={i} className="sk-acc-row">
              <div className="sk sk-acc-icon" />
              <div className="sk-acc-text">
                <div className="sk" style={{ height: "13px", width: `${w}px` }} />
                <div className="sk" style={{ height: "10px", width: `${w + 50}px` }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const ViewProduct = () => {
  const [product, setProduct] = useState(null);

  return (
    <div className="ViewProduct-Components">

      {!product && <ProductPageSkeleton />}

  
      <div style={{ display: product ? "block" : "none" }}>
        <motion.div
          className="ViewProduct-sticky-wrapper"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Comp1 product={product} setProduct={setProduct} />
        </motion.div>
      </div>

      {/* Baaki components sirf product aane ke baad */}
      {product && (
        <>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <Suspense fallback={null}>
              <Comp5 currentProduct={product} />
            </Suspense>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <Suspense fallback={null}>
              <Comp3 />
            </Suspense>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <Suspense fallback={null}>
              <Comp4 />
            </Suspense>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ViewProduct;