import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import BottomNavbar from "../Component/Navbarbottom";

const Comp1  = lazy(() => import("../Component/Landing/LandingCom1"));
const Comp2  = lazy(() => import("../Component/Landing/LandingCom2"));
const Comp3  = lazy(() => import("../Component/Landing/LandingCom3"));
const Comp4  = lazy(() => import("../Component/Landing/LandingCom4"));
const Comp5  = lazy(() => import("../Component/Landing/LandingCom5"));
const Comp6  = lazy(() => import("../Component/Landing/LandingCom6"));
const Comp7  = lazy(() => import("../Component/Landing/LandingCom7"));
const Comp8  = lazy(() => import("../Component/Landing/LandingCom8"));
const Comp9  = lazy(() => import("../Component/Landing/LandingCom9"));
const Comp10 = lazy(() => import("../Component/Landing/LandingCom10"));
const Comp11 = lazy(() => import("../Component/Landing/GenderSection"));


function BottomSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px 0",
      gap: "8px"
    }}>
      <div style={{
        width: "10px", height: "10px", borderRadius: "50%",
        background: "#2874f0",
        animation: "bounce 0.6s ease-in-out infinite",
        animationDelay: "0s"
      }}/>
      <div style={{
        width: "10px", height: "10px", borderRadius: "50%",
        background: "#2874f0",
        animation: "bounce 0.6s ease-in-out infinite",
        animationDelay: "0.15s"
      }}/>
      <div style={{
        width: "10px", height: "10px", borderRadius: "50%",
        background: "#2874f0",
        animation: "bounce 0.6s ease-in-out infinite",
        animationDelay: "0.3s"
      }}/>
    </div>
  );
}


function EmptyPlaceholder() {
  return <div style={{ minHeight: "100px" }} />;
}

const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Landing = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );


  const [visibleCount, setVisibleCount] = useState(2); // pehle 2 load karo
  const loaderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allComponents = [
    Comp1,
    ...(isMobile ? [Comp11] : []),
    Comp2, Comp5, Comp3, Comp4,
    Comp8, Comp6, Comp9, Comp7, Comp10,
  ];

  const isAllLoaded = visibleCount >= allComponents.length;

  useEffect(() => {
    if (isAllLoaded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + 2, allComponents.length) // 2-2 load karo
          );
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, isAllLoaded, allComponents.length]);

  return (
    <div className="Landing-Components">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      {allComponents.slice(0, visibleCount).map((Component, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"  
        >
          <Suspense fallback={<EmptyPlaceholder />}>
            <Component />
          </Suspense>
        </motion.div>
      ))}

    
      {!isAllLoaded && (
        <div ref={loaderRef}>
          <BottomSpinner />
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default Landing;