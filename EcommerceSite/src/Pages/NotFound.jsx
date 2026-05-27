import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Style-CSS/Pages/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.5,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      dots.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124, 58, 237, 0.2)";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="nf-root">
      <canvas ref={canvasRef} className="nf-canvas" />

      <div className="nf-deco nf-deco-tr" />
      <div className="nf-deco nf-deco-bl" />
      <div className="nf-deco nf-deco-sm" />

      <div className="nf-content">
        <div className="nf-badge">Error 404</div>

        <div className="nf-num">
          4<span className="nf-num-accent">0</span>4
        </div>

        <h1 className="nf-title">Oops! Page not found</h1>

        <p className="nf-desc">
          The page you're looking for doesn't exist
          <br />
          or may have been moved.
        </p>

        <div className="nf-actions">
          <button className="nf-btn-primary" onClick={() => navigate("/")}>
            Go to Home
          </button>
          <button className="nf-btn-ghost" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>

        <div className="nf-links">
          <span className="nf-links-label">Explore:</span>
          <button className="nf-chip" onClick={() => navigate("/subcategory/69df762cc36c4e4a68a29fcc")}>Women</button>
          <button className="nf-chip" onClick={() => navigate("/subcategory/69f0de9972b1c54e255785b8")}>Men</button>
          <button className="nf-chip" onClick={() => navigate("/kids")}>Kids</button>
          <button className="nf-chip" onClick={() => navigate("/wedding")}>Wedding</button>
        </div>
      </div>
    </div>
  );
}