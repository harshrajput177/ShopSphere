import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/Subcategory/ManageSubcategory.css";

const ManageSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [editData, setEditData] = useState(null);

  // GET ALL DATA
  const fetchData = async () => {
    try {
      const subRes = await axios.get(
        "http://localhost:4000/api/subcategory"
      );

      const catRes = await axios.get(
        "http://localhost:4000/api/category"
      );

      const genderRes = await axios.get(
        "http://localhost:4000/api/gender"
      );

      setSubCategories(subRes.data.subCategories || []);
      setCategories(catRes.data.categories || []);
      setGenders(genderRes.data.genders || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/subcategory/${id}`
      );

      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  // EDIT CLICK
  const handleEditClick = (item) => {
    setEditData({
      ...item,
      category: item.category?._id || item.category,
      gender: item.gender?._id || item.gender
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editData.name);
      formData.append("category", editData.category);
      formData.append("gender", editData.gender);

      if (editData.imageFile) {
        formData.append("image", editData.imageFile);
      }

      const res = await axios.put(
        `http://localhost:4000/api/subcategory/${editData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);
      alert("Subcategory Updated Successfully ✅");

      setEditData(null);
      fetchData();

    } catch (err) {
      console.log(err.response?.data || err);
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="sub-container">
      <h2>All Sub Categories</h2>

      {editData && (
        <div className="edit-box">

          {/* IMAGE PREVIEW */}
          <img
            src={
              editData.imageFile
                ? URL.createObjectURL(editData.imageFile)
                : editData.image?.replace(".avif.avif", ".avif")
            }
            width="100"
            alt="preview"
          />

          <br /><br />

          {/* NAME */}
          <input
            value={editData.name || ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                name: e.target.value
              })
            }
          />

          <br /><br />

          {/* CATEGORY */}
          <select
            value={editData.category || ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                category: e.target.value
              })
            }
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <br /><br />

          {/* GENDER */}
          <select
            value={editData.gender || ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                gender: e.target.value
              })
            }
          >
            <option value="">Select Gender</option>

            {genders.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} ({g.category?.name})
              </option>
            ))}
          </select>

          <br /><br />

          {/* FILE */}
          <input
            type="file"
            onChange={(e) =>
              setEditData({
                ...editData,
                imageFile: e.target.files[0]
              })
            }
          />

          <br /><br />

          <button onClick={handleUpdate}>
            Update
          </button>

          <button onClick={() => setEditData(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="sub-grid">
        {subCategories.map((item) => (
          <div className="sub-card" key={item._id}>
            <img
              src={`${item.image?.replace(".avif.avif", ".avif")}?t=${new Date().getTime()}`}
              alt={item.name}
            />

            <h3>{item.name}</h3>
            <p>{item.category?.name}</p>
            <p>{item.gender?.name}</p>

            <div className="actions">
              <button onClick={() => handleEditClick(item)}>
                Edit
              </button>

              <button onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSubCategory;