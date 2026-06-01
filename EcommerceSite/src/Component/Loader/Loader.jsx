// src/Component/PageLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(20);

    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(90), 300);
    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]); // route change hote hi trigger

  if (!loading) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: `${progress}%`,
      height: "3px",
      background: "linear-gradient(90deg, #2874f0, #fb641b)", // Flipkart colors
      zIndex: 99999,
      transition: "width 0.3s ease",
      borderRadius: "0 2px 2px 0",
      boxShadow: "0 0 8px rgba(40,116,240,0.6)"
    }} />
  );
}