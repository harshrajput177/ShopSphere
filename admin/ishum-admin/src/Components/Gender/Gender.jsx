import React, { useEffect, useState } from "react";
import "../../CSS/Gender/Gender.css";
import axios from "axios";

const BASE = "http://localhost:4000";

const AddGender = () => {
  const [name, setName]           = useState("");
  const [image, setImage]         = useState(null);
  const [category, setCategory]   = useState("");
  const [categories, setCategories] = useState([]);
  const [genders, setGenders]     = useState([]);
  const [editId, setEditId]       = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    axios.get(`${BASE}/api/category`)
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  const fetchGenders = async () => {
    try {
      const res = await axios.get(`${BASE}/api/gender`);
      setGenders(res.data.genders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchGenders(); }, []);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setCategory("");
    setImage(null);
    setEditImageUrl("");
  };

  const handleEdit = (gender) => {
    setEditId(gender._id);
    setName(gender.name);
    setCategory(gender.category?._id || gender.category || "");
    setEditImageUrl(gender.image || "");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gender?")) return;
    try {
      await axios.delete(`${BASE}/api/gender/${id}`);
      alert("Deleted ✅");
      fetchGenders();
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  const handleSubmit = async () => {
    if (!name) return alert("Please select a gender name");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      if (image) formData.append("image", image);

      if (editId) {
        await axios.put(`${BASE}/api/gender/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Updated ✅");
      } else {
        await axios.post(`${BASE}/api/gender`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Added ✅");
      }
      resetForm();
      fetchGenders();
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  return (
    <div className="ag-wrapper">

      {/* ── FORM CARD ── */}
      <div className="ag-card">
        <h2 className="ag-card-title">
          {editId ? "Edit gender" : "Add gender"}
        </h2>

        <label className="ag-label">Gender name</label>
        <select
          className="ag-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>

        <label className="ag-label">Category</label>
        <select
          className="ag-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="ag-label">Image</label>
        <input
          type="file"
          accept="image/*"
          className="ag-file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {(image || editImageUrl) && (
          <div className="ag-preview">
            <img
              src={image ? URL.createObjectURL(image) : editImageUrl}
              alt="preview"
              className="ag-preview-img"
            />
            {image && (
              <p className="ag-preview-name">{image.name}</p>
            )}
          </div>
        )}

        <div className="ag-btn-row">
          <button className="ag-btn-primary" onClick={handleSubmit}>
            {editId ? "Update gender" : "Save gender"}
          </button>
          {editId && (
            <button className="ag-btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── LIST CARD ── */}
      <div className="ag-card">
        <h2 className="ag-card-title">Existing genders</h2>

        <div className="ag-table-wrap">
          <table className="ag-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {genders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="ag-empty">
                    No genders added yet
                  </td>
                </tr>
              ) : (
                genders.map((g) => (
                  <tr key={g._id}>
                    <td>
                      {g.image && (
                        <img
                          src={g.image}
                          alt={g.name}
                          className="ag-thumb"
                        />
                      )}
                    </td>
                    <td>{g.name}</td>
                    <td>
                      <span className="ag-badge">
                        {g.category?.name || "—"}
                      </span>
                    </td>
                    <td className="ag-actions">
                      <button
                        className="ag-icon-btn"
                        onClick={() => handleEdit(g)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="ag-icon-btn ag-icon-btn--danger"
                        onClick={() => handleDelete(g._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddGender;