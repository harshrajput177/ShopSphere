import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useParams } from "react-router-dom";
import CustomerReviews from "./CustomerReview";
import "../../Style-CSS/ProductPage/ProductTab.css";

// ── Icons (inline SVG so no extra dep) ──────────────────────
const ChevronIcon = ({ open }) => (
  <svg
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.28s ease" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const icons = {
  details:  "⊞",
  info:     "ⓘ",
  vendor:   "👤",
  returns:  "↩",
};

// ── Accordion Item ──────────────────────────────────────────
const AccordionItem = ({ icon, title, subtitle, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`pis-accordion-item ${open ? "open" : ""}`}>
      <button className="pis-accordion-trigger" onClick={() => setOpen(!open)}>
        <div className="pis-accordion-left">
          <span className="pis-accordion-icon">{icon}</span>
          <div>
            <p className="pis-accordion-title">{title}</p>
            {subtitle && <p className="pis-accordion-subtitle">{subtitle}</p>}
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div className="pis-accordion-body" style={{ maxHeight: open ? "600px" : "0px" }}>
        <div className="pis-accordion-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const ProductInfoSection = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, [id]);

  const cleanValue = (v) => {
    if (v === null || v === undefined || v === "" || v === "null") return "—";
    if (Array.isArray(v)) return v.join(", ");
    return String(v).replace(/"/g, "").trim();
  };

  if (!product) return null;

  const specs = product?.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <div className="pis-wrapper">
      <div className="pis-inner">

        {/* ── PRODUCT INFORMATION ── */}
        <section className="pis-section">
          <h2 className="pis-section-heading">Product Information</h2>

          <div className="pis-accordion-group">

            {/* Product Details */}
            <AccordionItem
              icon={icons.details}
              title="Product details"
              subtitle="Care instructions, Pack contains"
              defaultOpen={false}
            >
              <div className="pis-spec-grid">
                {specs.length > 0 ? specs.map(([key, val]) => (
                  <div className="pis-spec-row" key={key}>
                    <span className="pis-spec-key">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                    </span>
                    <span className="pis-spec-val">{cleanValue(val)}</span>
                  </div>
                )) : (
                  <p className="pis-empty">No details available.</p>
                )}
              </div>
            </AccordionItem>

            {/* Know Your Product */}
            <AccordionItem
              icon={icons.info}
              title="Know your product"
              subtitle="Description"
              defaultOpen={false}
            >
              <div className="pis-desc-block">
                <p>{cleanValue(product?.description)}</p>
                {product?.gender && (
                  <div className="pis-spec-row">
                    <span className="pis-spec-key">Gender</span>
                    <span className="pis-spec-val">{cleanValue(product.gender)}</span>
                  </div>
                )}
                {product?.category && (
                  <div className="pis-spec-row">
                    <span className="pis-spec-key">Category</span>
                    <span className="pis-spec-val">{cleanValue(product.category)}</span>
                  </div>
                )}
              </div>
            </AccordionItem>

            {/* Vendor Details */}
            <AccordionItem
              icon={icons.vendor}
              title="Vendor details"
              subtitle="Country of origin, Manufacturer details"
            >
              <div className="pis-spec-grid">
                <div className="pis-spec-row">
                  <span className="pis-spec-key">Brand</span>
                  <span className="pis-spec-val">
                    {cleanValue(product?.brand || product?.specifications?.Brand)}
                  </span>
                </div>
                <div className="pis-spec-row">
                  <span className="pis-spec-key">Country of Origin</span>
                  <span className="pis-spec-val">India</span>
                </div>
                <div className="pis-spec-row">
                  <span className="pis-spec-key">Marketed By</span>
                  <span className="pis-spec-val">{cleanValue(product?.brand || "—")}</span>
                </div>
              </div>
            </AccordionItem>

            {/* Return Policy */}
            <AccordionItem
              icon={icons.returns}
              title="Return and exchange policy"
              subtitle="Know more about return and exchange"
            >
              <div className="pis-policy-list">
                <div className="pis-policy-item">
                  <span className="pis-policy-dot" />
                  <p>7-day return policy from the date of delivery.</p>
                </div>
                <div className="pis-policy-item">
                  <span className="pis-policy-dot" />
                  <p>Items must be unused, unwashed and in original packaging with tags intact.</p>
                </div>
                <div className="pis-policy-item">
                  <span className="pis-policy-dot" />
                  <p>Free size exchange available within 7 days.</p>
                </div>
                <div className="pis-policy-item">
                  <span className="pis-policy-dot" />
                  <p>Cash on Delivery available on all orders.</p>
                </div>
              </div>
            </AccordionItem>

          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="pis-divider" />

        {/* ── RATING & REVIEWS ── */}
        <section className="pis-section">
          <h2 className="pis-section-heading">Rating &amp; Reviews</h2>
          <CustomerReviews />
        </section>

      </div>
    </div>
  );
};

export default ProductInfoSection;