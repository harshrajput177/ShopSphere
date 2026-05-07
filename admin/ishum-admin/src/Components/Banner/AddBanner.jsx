import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import "./AddBanner.css";

const API = "http://localhost:4000/api/banner";

const BannerPage = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="add-banner-container">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Banner
        </button>
        <button
          className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Banners
        </button>
      </div>

      {activeTab === "add" ? <AddBanner /> : <ManageBanners />}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADD BANNER
// ─────────────────────────────────────────────
const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("link", link);
      formData.append("offsetX", position.x);
      formData.append("offsetY", position.y);

      await axios.post(`${API}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banner uploaded successfully ✅");
      setImage(null);
      setPreview("");
      setTitle("");
      setLink("");
      setPosition({ x: 0, y: 0 });
    } catch (error) {
      console.error(error);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-banner-form">
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {preview && (
        <div className="Banner-preview-box">
          <Draggable
            nodeRef={nodeRef}
            position={position}
            bounds="parent"
            onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
          >
            <img ref={nodeRef} src={preview} alt="preview" />
          </Draggable>
        </div>
      )}

      <div className="form-group">
        <label>Banner Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Redirect Link</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload Banner"}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// MANAGE BANNERS
// ─────────────────────────────────────────────
const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [editBanner, setEditBanner] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const cleanUrl = (url) => url?.replace(/(\.[a-zA-Z]+)\1$/, "$1") || "";

  const loadBanners = async () => {
    try {
      const res = await axios.get(API);
      setBanners(res.data.banners || []);
    } catch (e) {
      alert("Banners load nahi hue!");
    }
  };

  const openEdit = (b) => {
    setEditBanner(b);
    setTitle(b.title || "");
    setLink(b.link || "");
    setFile(null);
    setPreview(cleanUrl(b.image));
  };

  const closeEdit = () => {
    setEditBanner(null);
    setFile(null);
    setPreview("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", title);
      fd.append("link", link);
      if (file) fd.append("image", file);

      await axios.put(`${API}/${editBanner._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banner update ho gaya ✅");
      closeEdit();
      loadBanners();
    } catch (e) {
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Banner delete karna chahte ho?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("Banner delete ho gaya ✅");
      loadBanners();
    } catch (e) {
      alert("Delete failed ❌");
    }
  };

  // ── Edit Form ──
  if (editBanner) {
    return (
      <form onSubmit={handleUpdate} className="add-banner-form">
        <h3 style={{ marginBottom: "16px" }}>Banner Edit Karo</h3>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Redirect Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nai Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {preview && (
          <div className="Banner-preview-box">
            <Draggable nodeRef={nodeRef} bounds="parent">
              <img ref={nodeRef} src={preview} alt="preview" />
            </Draggable>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={closeEdit}
            style={{ background: "#ccc", color: "#333" }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // ── Banner List ──
  return (
    <div>
      {banners.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", marginTop: "30px" }}>
          Koi banner nahi hai. Pehle add karo!
        </p>
      ) : (
        <div className="banner-grid">
          {banners.map((b) => (
            <div key={b._id} className="banner-card">
              <img
                src={cleanUrl(b.image)}
                alt={b.title}
                className="banner-card-img"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="banner-card-body">
                <p className="banner-card-title">{b.title || "No Title"}</p>
                {b.link && (
                  <p className="banner-card-link">{b.link}</p>
                )}
                <div className="banner-card-actions">
                  <button onClick={() => openEdit(b)} className="btn-edit">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerPage;