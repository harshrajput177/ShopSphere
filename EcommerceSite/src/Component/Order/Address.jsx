import React, { useState, useEffect } from "react";
import { useDispatch }     from "react-redux";
import { addAddress }      from "../Store/Slices/addressSlice";
import "../../Style-CSS/Order/Address.css";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const TYPE_OPTIONS = [
  { label: "Home",  icon: "🏠" },
  { label: "Work",  icon: "💼" },
  { label: "Other", icon: "📍" },
];

const AddressForm = ({ onClose, existing, prefillData }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(
    existing || {
      name: "", phone: "", pincode: "", locality: "",
      address: "", city: "", state: "", landmark: "",
      addressType: "Home", isDefault: false,
    }
  );

  // ── prefillData aane par fields auto-fill ──────────────
  useEffect(() => {
    if (!prefillData) return;
    setForm((prev) => ({
      ...prev,
      pincode:  prefillData.pincode  || prev.pincode,
      locality: prefillData.locality || prev.locality,
      city:     prefillData.city     || prev.city,
      state:    prefillData.state    || prev.state,
      address:  prefillData.address  || prev.address,
    }));
  }, [prefillData]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  // ── Pincode se city/state auto-fetch ──────────────────
  const handlePincodeBlur = async () => {
    if (form.pincode.length !== 6) return;
    try {
      const res  = await fetch(
        `https://api.postalpincode.in/pincode/${form.pincode}`
      );
      const data = await res.json();
      if (data[0].Status !== "Success") return;

      const po = data[0].PostOffice?.find(
        (p) => p.DeliveryStatus === "Delivery"
      ) || data[0].PostOffice?.[0];

      if (!po) return;

      setForm((prev) => ({
        ...prev,
        city:     po.District || po.Division || prev.city,
        state:    po.State    || prev.state,
        locality: prev.locality || po.Name || "",
      }));
    } catch (_) {}
  };

  const handleSubmit = async () => {
    const required = ["name", "phone", "pincode", "address", "city", "state"];
    const missing  = required.filter((f) => !form[f]);
    if (missing.length) return alert("Please fill all required fields.");

    setSaving(true);
    await dispatch(addAddress(form));
    setSaving(false);
    onClose();
  };

  return (
    <div className="address-form-wrapper">

      {/* Title */}
   {/* Title */}
<h3 className="address-form-title">
  <span className="address-form-title-icon">📍</span>
  {existing ? "Edit Address" : "Add New Address"}

  {/* ← Ye add karo */}
  <button className="address-form-close-btn" onClick={onClose}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
</h3>

      {/* prefill banner */}
      {prefillData && (
        <div className="prefill-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
          Location detected — please verify and fill remaining fields
        </div>
      )}

      {/* ── Personal Details ── */}
      <div className="form-section-divider">Personal Details</div>
      <div className="address-form-grid">

        <div className="field-group">
          <label className="field-label">
            Full Name <span className="required-mark">*</span>
          </label>
          <input
            className="form-input"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label className="field-label">
            Phone <span className="required-mark">*</span>
          </label>
          <input
            className="form-input"
            name="phone"
            placeholder="10-digit number"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

      </div>

      {/* ── Address Details ── */}
      <div className="form-section-divider" style={{ marginTop: 20 }}>
        Address Details
      </div>
      <div className="address-form-grid">

        {/* Pincode — onBlur se city/state fetch */}
        <div className="field-group">
          <label className="field-label">
            Pincode <span className="required-mark">*</span>
          </label>
          <input
            className={`form-input ${prefillData?.pincode ? "prefilled" : ""}`}
            name="pincode"
            placeholder="6-digit pincode"
            value={form.pincode}
            onChange={handleChange}
            onBlur={handlePincodeBlur}
            maxLength={6}
          />
        </div>

        {/* Locality */}
        <div className="field-group">
          <label className="field-label">
            Locality <span className="required-mark">*</span>
          </label>
          <input
            className={`form-input ${prefillData?.locality ? "prefilled" : ""}`}
            name="locality"
            placeholder="Area / Colony"
            value={form.locality}
            onChange={handleChange}
          />
        </div>

        {/* City */}
        <div className="field-group">
          <label className="field-label">
            City <span className="required-mark">*</span>
          </label>
          <input
            className={`form-input ${prefillData?.city ? "prefilled" : ""}`}
            name="city"
            placeholder="Your city"
            value={form.city}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="field-group">
          <label className="field-label">
            State <span className="required-mark">*</span>
          </label>
          <div className="select-wrapper">
            <select
              className={`form-select ${prefillData?.state ? "prefilled" : ""}`}
              name="state"
              value={form.state}
              onChange={handleChange}
            >
              <option value="">Select state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="field-group full-width">
          <label className="field-label">
            Address <span className="required-mark">*</span>
          </label>
          <textarea
            className={`form-textarea ${prefillData?.address ? "prefilled" : ""}`}
            name="address"
            placeholder="House no., Building, Street name"
            value={form.address}
            onChange={handleChange}
            rows={2}
          />
        </div>

        {/* Landmark */}
        <div className="field-group full-width">
          <label className="field-label">Landmark</label>
          <input
            className="form-input"
            name="landmark"
            placeholder="Near school, mall, etc. (optional)"
            value={form.landmark}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* ── Address Type ── */}
      <div className="form-section-divider" style={{ marginTop: 20 }}>
        Address Type
      </div>
      <div className="type-selector">
        {TYPE_OPTIONS.map(({ label, icon }) => (
          <button
            key={label}
            className={`type-btn ${form.addressType === label ? "active" : ""}`}
            onClick={() => setForm((p) => ({ ...p, addressType: label }))}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Default Toggle */}
      <label className="default-check-label">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />
        Set as my default address
      </label>

      {/* Actions */}
      <div className="form-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button
          className="btn-save"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Address →"}
        </button>
      </div>

    </div>
  );
};

export default AddressForm;