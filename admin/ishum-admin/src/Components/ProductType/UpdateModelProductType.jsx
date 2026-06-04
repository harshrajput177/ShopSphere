import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/ProductType/UpdateModel.css";

const GROUP_OPTIONS = [
  "Topwear",
  "Bottomwear",
  "Innerwear",
  "Co-ord Set",
  "OnePiece",
  "Outerwear",
  "Other",
];

const UpdateModal = ({ item, closeModal, refresh }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [group, setGroup] = useState("");

  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSubCategory(item.subCategory?._id || item.subCategory || "");
      setGroup(item.group || ""); // ✅ Pre-fill group
    }

    fetchSubCategories();
  }, [item]);

  // GET ALL SUBCATEGORIES
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/subcategory");
      setSubCategories(res.data.subCategories || []);
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("subCategory", subCategory);
    formData.append("group", group); // ✅ Send group

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/product-type/update/${item._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Updated Successfully ✅");
        refresh();
        closeModal();
      }
    } catch (err) {
      console.log(err);
      alert("Error updating ❌");
    }
  };

  return (
    <div className="Manageproducttpye-modal-overlay">
      <div className="Manageproducttpye-modal-box">
        <h3>Edit Product Type</h3>

        <form onSubmit={handleUpdate}>

          {/* NAME */}
          <input
            type="text"
            value={name}
            placeholder="Product Type Name"
            onChange={(e) => setName(e.target.value)}
          />

          <br /><br />

          {/* SUBCATEGORY */}
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">Select SubCategory</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name} ({sub.gender?.name})
              </option>
            ))}
          </select>

          <br /><br />

          {/* ✅ GROUP */}
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">Select Group</option>
            {GROUP_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <br /><br />

          {/* IMAGE */}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <br /><br />

          <div className="Manageproducttpye-modal-actions">
            <button type="submit">Update</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateModal;