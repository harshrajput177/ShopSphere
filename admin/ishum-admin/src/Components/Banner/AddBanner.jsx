import React, { useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { useRef } from "react";
import "./AddBanner.css";

const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: position state
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const nodeRef = useRef(null);

  // 🔥 Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
      setPosition({ x: 0, y: 0 }); // reset position
    }
  };

  // 🔥 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("link", link);

      // 🔥 SAVE POSITION
      formData.append("offsetX", position.x);
      formData.append("offsetY", position.y);

      await axios.post(
        "http://localhost:4000/api/banner/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
    <div className="add-banner-container">
      <h2>Add Banner</h2>

      <form onSubmit={handleSubmit} className="add-banner-form">

        {/* Upload */}
        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* 🔥 DRAG PREVIEW */}
        {preview && (
          <div className="Banner-preview-box">

            <Draggable
              nodeRef={nodeRef}
              position={position}
              bounds="parent"
              onDrag={(e, data) => {
                setPosition({ x: data.x, y: data.y });
              }}
            >
              <img ref={nodeRef}
                src={preview}
                alt="preview" />
            </Draggable>

          </div>
        )}

        {/* Title */}
        <div className="form-group">
          <label>Banner Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Link */}
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
    </div>
  );
};

export default AddBanner;