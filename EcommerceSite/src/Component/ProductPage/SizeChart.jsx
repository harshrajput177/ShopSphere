import React from "react";
import "../../Style-CSS/ProductPage/SizeChartModal.css";

const getMeasurementTip = (field) => {
  const tips = {
    Bust: "Measure around the fullest part of your chest",
    Chest: "Measure around the fullest part of your chest",
    Waist: "Measure around the narrowest part of your waist",
    Hip: "Measure around the fullest part of your hips",
    Hips: "Measure around the fullest part of your hips",
    Length: "Measure from shoulder to hem",
    Shoulder: "Measure from shoulder point to shoulder point",
    Sleeve: "Measure from shoulder to wrist",
    Inseam: "Measure from crotch to ankle",
    Thigh: "Measure around the fullest part of your thigh",
  };
  return tips[field] || `Measure your ${field.toLowerCase()} accurately`;
};

const getValues = (values) => {
  if (!values) return {};
  if (values instanceof Map) return Object.fromEntries(values);
  if (typeof values === "object") return values;
  return {};
};

const SizeChartModal = ({ sizeChart, onClose }) => {
  if (!sizeChart || sizeChart.length === 0) return null;

  const firstValues = getValues(sizeChart[0]?.values);
  const fields = Object.keys(firstValues);

  if (fields.length === 0) return null;

  return (
    <div className="sc-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-header">
          <div>
            <h2 className="sc-title">Size Guide</h2>
            <p className="sc-subtitle">All measurements are in inches</p>
          </div>
          <button className="sc-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sc-tip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Measure yourself and compare with the chart below for the best fit</span>
        </div>

        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th className="sc-th sc-th-size">Size</th>
                {fields.map((field) => (
                  <th key={field} className="sc-th">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => {
                const rowValues = getValues(row.values);
                return (
                  <tr key={i} className="sc-row">
                    <td className="sc-td sc-td-size">{row.size}</td>
                    {fields.map((field) => (
                      <td key={field} className="sc-td">
                        {rowValues[field] || "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sc-how">
          <p className="sc-how-title">How to measure</p>
          <div className="sc-how-grid">
            {fields.map((field) => (
              <div key={field} className="sc-how-item">
                <span className="sc-how-dot" />
                <div>
                  <p className="sc-how-name">{field}</p>
                  <p className="sc-how-desc">{getMeasurementTip(field)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;