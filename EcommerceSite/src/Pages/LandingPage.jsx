import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "../Pages/LoaderFullpage";
import BottomNavbar from "../Component/Navbarbottom"; // Adjust the path if needed
import Comp1 from "../Component/Landing/LandingCom1"
import Comp2 from "../Component/Landing/LandingCom2"
import Comp3 from "../Component/Landing/LandingCom3"
import Comp4 from "../Component/Landing/LandingCom4"
import Comp5 from "../Component/Landing/LandingCom5"
import Comp6 from "../Component/Landing/LandingCom6"
import Comp7 from "../Component/Landing/LandingCom7"
import Comp8 from "../Component/Landing/LandingCom8"
import Comp9 from "../Component/Landing/LandingCom9"
import Comp10 from "../Component/Landing/LandingCom10"

const Landing = () => {
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

  if (loading) {
    return <Loader />;
  }

  return (

      <div className="Landing-Components">
        {[Comp1, Comp2 , Comp5, Comp3, Comp4, Comp8,  Comp6 , Comp9, Comp7, Comp10].map(
          (Component, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Component />
            </motion.div>
          )
        )}

            <BottomNavbar />
      </div>

  );
};
export default Landing;

