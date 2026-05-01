import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/ProductType/UpdateModel.css";

const UpdateModal = ({ item, closeModal, refresh }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSubCategory(
        item.subCategory?._id || item.subCategory || ""
      );
    }

    fetchSubCategories();
  }, [item]);

  // GET ALL SUBCATEGORIES
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/subcategory"
      );

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

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/product-type/update/${item._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
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
            <option value="">
              Select SubCategory
            </option>

            {subCategories.map((sub) => (
              <option
                key={sub._id}
                value={sub._id}
              >
                {sub.name}
                {" "}
                (
                {sub.gender?.name}
                )
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
            <button type="submit">
              Update
            </button>

            <button
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateModal;