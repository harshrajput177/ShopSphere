import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../Style-CSS/Pages/ViewProductPage.css";
import Comp1 from "../Component/ProductPage/ViewProduct";
import Comp3 from "../Component/ProductPage/SimilarProduct";
import Comp4 from "../Component/ProductPage/RecentViewProduct";
import Comp5 from "../Component/ProductPage/YouMayAlso";

const ViewProduct = () => {
    const [product, setProduct] = useState(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 130 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };


return (
  <div className="ViewProduct-Components">

    {/* Product Detail */}
    <motion.div
      className="ViewProduct-sticky-wrapper"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Comp1       product={product}
        setProduct={setProduct}
      />
    </motion.div>

    {/* You May Also */}
    <motion.div
      className="ViewProduct-scroll-content"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Comp5 currentProduct={product} />
    </motion.div>

    {/* Similar Product */}
    <motion.div
      className="ViewProduct-scroll-content"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Comp3 />
    </motion.div>

    {/* Recent View */}
    <motion.div
      className="ViewProduct-scroll-content"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Comp4 />
    </motion.div>

  </div>
);
};

export default ViewProduct;