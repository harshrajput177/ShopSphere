import { useState } from "react";

const EditModal = ({ data, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: data.name,
    isFeatured: data.isFeatured,
    isActive: data.isActive
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("isFeatured", formData.isFeatured);
      form.append("isActive", formData.isActive);

      if (image) {
        form.append("image", image);
      }

      await axios.put(
        `http://localhost:4000/api/collection/update/${data._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Updated Successfully ✅");
      onClose();
      refresh();

    } catch (err) {
      console.log(err);
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Edit Collection</h3>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Featured
        </label>

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <div className="modal-buttons">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>

      </div>

    </div>
  );
};

export default EditModal;