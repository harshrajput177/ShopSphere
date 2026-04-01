import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/api/category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Category Added ✅");
      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("Error adding category");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Category</h2>

      {/* NAME */}
      <input
        type="text"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* IMAGE */}
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {/* PREVIEW */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          width="100"
        />
      )}

      <br /><br />

      <button onClick={handleSubmit}>
        Save Category
      </button>
    </div>
  );
};

export default AddCategory;