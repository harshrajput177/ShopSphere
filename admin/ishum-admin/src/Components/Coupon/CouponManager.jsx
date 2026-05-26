import React, { useEffect, useState } from "react";
import axios from "axios";

const EMPTY = {
  code: "", description: "", discountType: "percent", discountValue: "",
  maxDiscount: "", minOrderAmount: "", expiryDate: "", usageLimit: "", isActive: true
};

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

const load = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/coupons", {
      headers: localStorage.getItem("token")
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {},
      withCredentials: true,
    });

    console.log("COUPONS:", res.data); // debug

    setCoupons(res.data); // ✅ FIXED
  } catch (err) {
    console.error("LOAD ERROR:", err.response?.data || err.message);
    setCoupons([]);
  }
};

  useEffect(() => { load(); }, []);

 const save = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      withCredentials: true, // 👈 cookie support
    };

    if (editId) {
      await axios.put(
        `http://localhost:4000/api/coupons/${editId}`,
        form,
        config
      );
    } else {
      await axios.post(
        `http://localhost:4000/api/coupons`,
        form,
        config
      );
    }

    setForm(EMPTY);
    setEditId(null);

    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);

    load();
  } catch (err) {
    console.error("SAVE ERROR:", err.response?.data || err.message);
    setMsg(err.response?.data?.message || "Error saving coupon");
  }
};

  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`/api/coupons/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    load();
  };

  const edit = (c) => {
    setEditId(c._id);
    setForm({ ...c, expiryDate: c.expiryDate?.slice(0, 10) });
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px" }}>
      <h2>Coupon Manager</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px", background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
        {[["code","Code (uppercase)"],["description","Description"],["discountValue","Discount Value"],["maxDiscount","Max Discount (optional)"],["minOrderAmount","Min Order ₹"],["usageLimit","Usage Limit (blank=unlimited)"]].map(([k, label]) => (
          <div key={k}>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>{label}</label>
            <input value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px" }} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Type</label>
          <select value={form.discountType} onChange={e => setForm(f => ({...f, discountType: e.target.value}))}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px" }}>
            <option value="percent">Percent %</option>
            <option value="flat">Flat ₹</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Expiry Date</label>
          <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({...f, expiryDate: e.target.value}))}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} id="active" />
          <label htmlFor="active" style={{ fontSize: "13px" }}>Active</label>
        </div>
        <div style={{ gridColumn: "span 3", display: "flex", gap: "8px" }}>
          <button onClick={save} style={{ padding: "8px 20px", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            {editId ? "Update" : "Create"} Coupon
          </button>
          {editId && <button onClick={() => { setForm(EMPTY); setEditId(null); }} style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>}
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            {["Code","Type","Value","Min Order","Expiry","Used","Active",""].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
         {Array.isArray(coupons) && coupons.map(c => (
            <tr key={c._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "8px 12px", fontWeight: "600" }}>{c.code}</td>
              <td style={{ padding: "8px 12px" }}>{c.discountType}</td>
              <td style={{ padding: "8px 12px" }}>{c.discountType === "flat" ? `₹${c.discountValue}` : `${c.discountValue}%`}</td>
              <td style={{ padding: "8px 12px" }}>₹{c.minOrderAmount}</td>
              <td style={{ padding: "8px 12px" }}>{new Date(c.expiryDate).toLocaleDateString("en-IN")}</td>
              <td style={{ padding: "8px 12px" }}>{c.usedCount}/{c.usageLimit ?? "∞"}</td>
              <td style={{ padding: "8px 12px" }}>
                <span style={{ color: c.isActive ? "green" : "red" }}>{c.isActive ? "Yes" : "No"}</span>
              </td>
              <td style={{ padding: "8px 12px", display: "flex", gap: "6px" }}>
                <button onClick={() => edit(c)} style={{ fontSize: "12px", padding: "4px 10px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => del(c._id)} style={{ fontSize: "12px", padding: "4px 10px", cursor: "pointer", color: "red" }}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}