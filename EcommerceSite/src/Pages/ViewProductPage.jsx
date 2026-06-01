import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import "../Style-CSS/Pages/ViewProductPage.css";
import Comp1 from "../Component/ProductPage/ViewProduct";
import Comp3 from "../Component/ProductPage/SimilarProduct";
import Comp4 from "../Component/ProductPage/RecentViewProduct";
import Comp5 from "../Component/ProductPage/YouMayAlso";

function ProductPageSkeleton() {
  return (
    <div style={{ display: "flex", gap: "24px", padding: "24px", maxWidth: "1300px", margin: "0 auto" , paddingTop:"80px"}}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sk { 
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 480% 150%;
          animation: shimmer 1.2s ease infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* Left - Images */}
      <div style={{ display: "flex", gap: "12px", flex: "0 0 55%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="sk" style={{ width: "84px", height: "90px" }} />
          ))}
        </div>
        <div className="sk" style={{ flex: 1, minHeight: "500px", borderRadius: "12px" }} />
      </div>

      {/* Right - Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px" }}>
        <div className="sk" style={{ height: "16px", width: "80px" }} />
        <div className="sk" style={{ height: "28px", width: "90%" }} />
        <div className="sk" style={{ height: "28px", width: "60%" }} />
        <div className="sk" style={{ height: "36px", width: "200px" }} />
        <div style={{ display: "flex", gap: "8px" }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="sk" style={{ width: "48px", height: "48px" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div className="sk" style={{ height: "52px", flex: 1 }} />
          <div className="sk" style={{ height: "52px", flex: 1 }} />
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