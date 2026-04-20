import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/ProductType/UpdateModel.css"

const UpdateModal = ({ item, closeModal, refresh }) => {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/product-type/update/${item._id}`,
        formData
      );

      if (res.data.success) {
        alert("Updated ✅");
        refresh();
        closeModal();
      }

    } catch (err) {
      console.log(err);
      alert("Error updating");
    }
  };

  return (
    <div className="Manageproducttpye-modal-overlay">

      <div className="Manageproducttpye-modal-box">
        <h3>Edit Product Type</h3>

        <form onSubmit={handleUpdate}>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

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