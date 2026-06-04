import React, { useEffect, useState } from "react";
import axios from "axios";
import "../BulkSizeChart/BulkSizeChart.css";

const BASE = "http://localhost:4000";

const BulkSizeChart = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productTypeId, setProductTypeId] = useState("");

  const [sizeFields, setSizeFields] = useState([]);
  const [sizeAttribute, setSizeAttribute] = useState(null);
  const [sizeChart, setSizeChart] = useState([]);

  const [productCount, setProductCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showPaste, setShowPaste] = useState(false);
  const [pasteInput, setPasteInput] = useState("");

  useEffect(() => {
    axios.get(`${BASE}/api/category`).then((r) => setCategories(r.data.categories));
  }, []);

  const handleCategory = async (id) => {
    setCategory(id);
    setSubcategory("");
    setProductTypeId("");
    setProductTypes([]);
    setSizeFields([]);
    setSizeChart([]);
    setProductCount(null);
    const r = await axios.get(`${BASE}/api/subcategory?category=${id}`);
    setSubcategories(r.data.subCategories);
  };

  const handleSubcategory = async (id) => {
    setSubcategory(id);
    setProductTypeId("");
    setProductTypes([]);
    setSizeFields([]);
    setSizeChart([]);
    setProductCount(null);
    const r = await axios.get(`${BASE}/api/product-type/subcategory/${id}`);
    setProductTypes(r.data.productTypes);
  };

  const handleProductType = async (id) => {
    setProductTypeId(id);
    setSizeChart([]);
    setSuccess("");
    setError("");

    const selectedSub = subcategories.find((s) => s._id === subcategory);
    const genderId = selectedSub?.gender?._id || selectedSub?.gender;

    try {
      const r = await axios.get(`${BASE}/api/sizechart/${id}/${genderId}`);
      setSizeFields(r.data.chart?.fields || []);
    } catch {
      setSizeFields([]);
    }

    try {
      const r = await axios.get(`${BASE}/api/attribute/product/${id}`);
      const sizeAttr = r.data.find(
        (a) => a.isSize || a.name.toLowerCase().includes("size")
      );
      setSizeAttribute(sizeAttr || null);
    } catch {
      setSizeAttribute(null);
    }

    try {
      const r = await axios.get(`${BASE}/api/sizechart/count/${id}`);
      setProductCount(r.data.count);
    } catch {
      setProductCount(null);
    }
  };

  const addRow = () => {
    setSizeChart((prev) => [...prev, { size: "", values: {} }]);
  };

  const removeRow = (i) => {
    setSizeChart((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateSize = (i, val) => {
    setSizeChart((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], size: val };
      return updated;
    });
  };

  const updateValue = (i, field, val) => {
    setSizeChart((prev) => {
      const updated = [...prev];
      updated[i] = {
        ...updated[i],
        values: { ...updated[i].values, [field]: val },
      };
      return updated;
    });
  };

  const parsePaste = () => {
    const lines = pasteInput
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("|"));

    const dataLines = lines.filter((l) => !/^[\|\-\s]+$/.test(l));
    const parseRow = (line) =>
      line
        .split("|")
        .map((c) => c.trim())
        .filter((_, i, a) => i > 0 && i < a.length - 1);

    const newRows = dataLines.slice(1).map((line) => {
      const cols = parseRow(line);
      const values = {};
      sizeFields.forEach((field, i) => {
        values[field] = cols[i + 1] || "";
      });
      return { size: cols[0], values };
    });

    setSizeChart(newRows);
    setPasteInput("");
    setShowPaste(false);
  };

  const handleSubmit = async () => {
    if (!productTypeId) return setError("Please select a product type ❌");
    if (sizeChart.length === 0) return setError("Size chart is empty ❌");
    if (sizeChart.some((r) => !r.size)) return setError("Please select size for all rows ❌");

    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const r = await axios.patch(`${BASE}/api/sizechart/bulk`, {
        productTypeId,
        sizeChart,
      });
      setSuccess(`${r.data.modifiedCount} products updated successfully ✅`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong ❌");
    }
    setLoading(false);
  };

  return (
    <div className="bsc-page">
      <div className="bsc-header">
        <h1 className="bsc-title">Bulk Size Chart Update</h1>
        <p className="bsc-subtitle">
          Select a product type — all products of that type will be updated at once
        </p>
      </div>

      <div className="bsc-card">
        <div className="bsc-card-label">
          <span className="bsc-step">01</span> Select Category
        </div>
        <div className="bsc-selects">
          <div className="bsc-select-wrap">
            <label>Category</label>
            <select value={category} onChange={(e) => handleCategory(e.target.value)}>
              <option value="">— Select —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bsc-select-wrap">
            <label>Sub Category</label>
            <select
              value={subcategory}
              onChange={(e) => handleSubcategory(e.target.value)}
              disabled={!category}
            >
              <option value="">— Select —</option>
              {subcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.gender?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="bsc-select-wrap">
            <label>Product Type</label>
            <select
              value={productTypeId}
              onChange={(e) => handleProductType(e.target.value)}
              disabled={!subcategory}
            >
              <option value="">— Select —</option>
              {productTypes.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {productCount !== null && (
          <div className="bsc-count-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
            <span>
              <b>{productCount}</b> products found for this product type — all will be updated
            </span>
          </div>
        )}
      </div>

      {sizeFields.length > 0 && (
        <div className="bsc-card">
          <div className="bsc-card-label">
            <span className="bsc-step">02</span> Fill Size Chart
          </div>

          <div className="bsc-fields-preview">
            <span className="bsc-fields-label">Columns:</span>
            {sizeFields.map((f) => (
              <span key={f} className="bsc-field-chip">{f}</span>
            ))}
          </div>

          <div className="bsc-table-actions">
            <button className="bsc-btn bsc-btn-outline" onClick={addRow}>
              + Add Row
            </button>
            <button
              className="bsc-btn bsc-btn-ghost"
              onClick={() => setShowPaste((p) => !p)}
            >
              📋 Paste Table
            </button>
            {sizeChart.length > 0 && (
              <button
                className="bsc-btn bsc-btn-danger-ghost"
                onClick={() => setSizeChart([])}
              >
                🗑 Clear All
              </button>
            )}
          </div>

          {showPaste && (
            <div className="bsc-paste-area">
              <textarea
                rows={6}
                placeholder={`Paste markdown table:\n| Size | ${sizeFields.join(" | ")} |\n| ---- | ${sizeFields.map(() => "----").join(" | ")} |\n| XS   | 32   | 24    | 34  |`}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
              />
              <div className="bsc-paste-btns">
                <button className="bsc-btn bsc-btn-primary" onClick={parsePaste}>
                  Fill from Table
                </button>
                <button
                  className="bsc-btn bsc-btn-ghost"
                  onClick={() => setShowPaste(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {sizeChart.length > 0 && (
            <div className="bsc-table-wrap">
              <table className="bsc-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    {sizeFields.map((f) => <th key={f}>{f}</th>)}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <select
                          value={row.size}
                          onChange={(e) => updateSize(i, e.target.value)}
                          className="bsc-size-select"
                        >
                          <option value="">Select Size</option>
                          {sizeAttribute?.options
                            ?.filter(
                              (s) =>
                                !sizeChart.some(
                                  (r, idx) => r.size === s && idx !== i
                                )
                            )
                            .map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                      </td>
                      {sizeFields.map((field) => (
                        <td key={field}>
                          <input
                            type="text"
                            placeholder={field}
                            value={row.values?.[field] || ""}
                            onChange={(e) => updateValue(i, field, e.target.value)}
                            className="bsc-field-input"
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          className="bsc-remove-btn"
                          onClick={() => removeRow(i)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {sizeChart.length === 0 && (
            <div className="bsc-empty">
              No rows added yet — use "Add Row" or "Paste Table" to get started
            </div>
          )}
        </div>
      )}

      {sizeFields.length === 0 && productTypeId && (
        <div className="bsc-card bsc-warn">
          ⚠️ No size chart found for this product type. Please add fields in the SizeChart model first.
        </div>
      )}

      {sizeChart.length > 0 && (
        <div className="bsc-card">
          <div className="bsc-card-label">
            <span className="bsc-step">03</span> Update Products
          </div>

          {success && <div className="bsc-success">{success}</div>}
          {error && <div className="bsc-error">{error}</div>}

          <div className="bsc-submit-row">
            <div className="bsc-submit-info">
              <p>
                <b>{sizeChart.length}</b> sizes ready to update
              </p>
              {productCount !== null && (
                <p className="bsc-submit-sub">
                  {productCount} products will be affected
                </p>
              )}
            </div>
            <button
              className="bsc-btn bsc-btn-primary bsc-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="bsc-spinner" />
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Bulk Update
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkSizeChart;