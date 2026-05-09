import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import BottomNavbar from "../Component/Navbarbottom";

// ✅ Lazy load — sabhi components alag chunks mein split honge
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

// ✅ Lightweight section skeleton — Loader import hataya
function SectionSkeleton() {
  return (
    <div style={{
      width: "100%",
      minHeight: "300px",
      background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      borderRadius: "12px",
      margin: "12px 0"
    }} />
  );
}

const fadeInUp = {
  hidden:  { opacity: 0, y: 60 },       // ✅ 130 → 60, zyada bounce jaruri nahi
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Landing = () => {
  // ✅ window check safe — SSR crash nahi karega
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const components = [
    Comp1,
    ...(isMobile ? [Comp11] : []),
    Comp2,
    Comp5,
    Comp3,
    Comp4,
    Comp8,
    Comp6,
    Comp9,
    Comp7,
    Comp10,
  ];

  return (
    <div className="Landing-Components">
      {/* ✅ shimmer CSS globally inject karo ek baar */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {components.map((Component, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}  // ✅ thoda pehle trigger ho
        >
          {/* ✅ har component ka apna skeleton fallback */}
          <Suspense fallback={<SectionSkeleton />}>
            <Component />
          </Suspense>
        </motion.div>
      ))}

      <BottomNavbar />
    </div>
  );
};

export default Landing;