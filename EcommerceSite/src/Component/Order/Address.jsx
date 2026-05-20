import React, { useState } from "react";
import { useDispatch }     from "react-redux";
import { addAddress }      from "../Store/Slices/addressSlice";
import "../../Style-CSS/Order/Address.css";

const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
  "West Bengal", "Gujarat", "Rajasthan", "Telangana", "Kerala",
  "Madhya Pradesh", "Punjab", "Haryana", "Bihar", "Odisha",
];

const TYPE_OPTIONS = [
  { label: "Home",  icon: "🏠" },
  { label: "Work",  icon: "💼" },
  { label: "Other", icon: "📍" },
];

const AddressForm = ({ onClose, existing }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(
    existing || {
      name: "", phone: "", pincode: "", locality: "",
      address: "", city: "", state: "", landmark: "",
      addressType: "Home", isDefault: false,
    }
  );

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
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
      <h3 className="address-form-title">
        <span className="address-form-title-icon">📍</span>
        Add New Address
      </h3>

      {/* Section: Personal Details */}
      <div className="form-section-divider">Personal Details</div>

      <div className="address-form-grid">
        {/* Name */}
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

        {/* Phone */}
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

      {/* Section: Address */}
      <div className="form-section-divider" style={{ marginTop: 20 }}>Address Details</div>

      <div className="address-form-grid">
        {/* Pincode */}
        <div className="field-group">
          <label className="field-label">
            Pincode <span className="required-mark">*</span>
          </label>
          <input
            className="form-input"
            name="pincode"
            placeholder="6-digit pincode"
            value={form.pincode}
            onChange={handleChange}
            maxLength={6}
          />
        </div>

        {/* Locality */}
        <div className="field-group">
          <label className="field-label">
            Locality <span className="required-mark">*</span>
          </label>
          <input
            className="form-input"
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
            className="form-input"
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
              className="form-select"
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

        {/* Address (full width) */}
        <div className="field-group full-width">
          <label className="field-label">
            Address <span className="required-mark">*</span>
          </label>
          <textarea
            className="form-textarea"
            name="address"
            placeholder="House no., Building, Street name"
            value={form.address}
            onChange={handleChange}
            rows={2}
          />
        </div>

        {/* Landmark (full width) */}
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

      {/* Address Type */}
      <div className="form-section-divider" style={{ marginTop: 20 }}>Address Type</div>
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
        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-save"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <>Saving…</>
          ) : (
            <>Save Address →</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;