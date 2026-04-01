import React, { useState } from "react";
import axios from "axios";

const AddCollection = () => {

  const [formData, setFormData] = useState({
    name: "",
    isFeatured: false,
    isActive: true
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle Image
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);
      data.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/api/collection/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Collection Added Successfully ✅");

      // Reset
      setFormData({
        name: "",
        isFeatured: false,
        isActive: true
      });
      setImage(null);

    } catch (error) {
      console.error(error);
      alert("Error adding collection ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-collection-container">

      <h2>Add Collection</h2>

      <form onSubmit={handleSubmit} className="add-collection-form">

        {/* Name */}
        <div className="form-group">
          <label>Collection Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter collection name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Collection Image</label>
          <input
            type="file"
            onChange={handleImage}
            required
          />
        </div>

        {/* Featured */}
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Featured Collection
          </label>
        </div>

        {/* Active */}
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Collection"}
        </button>

      </form>
    </div>
  );
};

export default AddCollection;