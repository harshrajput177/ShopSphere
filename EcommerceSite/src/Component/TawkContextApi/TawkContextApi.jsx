// src/context/TawkContext.js
import { createContext, useEffect } from "react";
import "../../App.css";

export const TawkContext = createContext();

export const TawkProvider = ({ children }) => {
  useEffect(() => {
    // Tawk.to script only added once
    const existingScript = document.getElementById("tawk-script");
    if (existingScript) return;

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/682ec38695bd451910021f61/1irrani1n";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    document.body.appendChild(s1);
  }, []);

  return (
    <TawkContext.Provider value={{}}>
      {children}
    </TawkContext.Provider>
  );
};
