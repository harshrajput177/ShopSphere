import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/Subcategory/ManageSubcategory.css";

const ManageSubCategory = () => {

  const [subCategories, setSubCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  // 🔥 GET ALL
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/subcategory");
      setSubCategories(res.data.subCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/subcategory/${id}`);
      fetchSubCategories();
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ EDIT CLICK
  const handleEditClick = (item) => {
    setEditData(item);
  };

  // ✏️ UPDATE
const handleUpdate = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editData.name);

    if (editData.imageFile) {
      formData.append("image", editData.imageFile);
    }

    await axios.put(
      `http://localhost:4000/api/subcategory/${editData._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setEditData(null);
    fetchSubCategories();
  } catch (err) {
    console.log(err);
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
          : editData.image
      }
      width="100"
    />

    {/* NAME */}
    <input
      value={editData?.name || ""}
      onChange={(e) =>
        setEditData({ ...editData, name: e.target.value })
      }
    />

    {/* FILE */}
    <input
      type="file"
      onChange={(e) =>
        setEditData({ ...editData, imageFile: e.target.files[0] })
      }
    />

    <button onClick={handleUpdate}>Update</button>
    <button onClick={() => setEditData(null)}>Cancel</button>
  </div>
)}

      {/* LIST */}
      <div className="sub-grid">
        {subCategories.map((item) => (
          <div className="sub-card" key={item._id}>
            <img src={`${item.image}?t=${new Date().getTime()}`} />
            <h3>{item.name}</h3>
            <p>{item.category?.name}</p>

            <div className="actions">
              <button onClick={() => handleEditClick(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSubCategory;