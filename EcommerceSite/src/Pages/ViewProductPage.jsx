import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../Style-CSS/Pages/ViewProductPage.css";
import Loader from "../Pages/LoaderFullpage";
import Comp1 from "../Component/ProductPage/ViewProduct";
import Comp2 from "../Component/ProductPage/ProductTab";
import Comp3 from "../Component/ProductPage/SimilarProduct";
import Comp4 from "../Component/ProductPage/RecentViewProduct";
import Comp5 from "../Component/ProductPage/YouMayAlso";

const ViewProduct = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 130 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <Loader />;

  return (
    <div className="ViewProduct-Components">
      {[Comp1, Comp2, Comp3, Comp4, Comp5].map((Component, index) => (
        <motion.div
          key={index}
          className={index === 0 ? "ViewProduct-sticky-wrapper" : "ViewProduct-scroll-content"}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  );
};

export default ViewProduct;