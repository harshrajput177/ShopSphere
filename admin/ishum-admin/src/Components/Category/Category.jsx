import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const examples = [
    "Clothing",
    "Electronics",
    "Beauty Products",
    "Home Decor",
    "Kitchen",
    "Grocery",
    "Footwear",
    "Furniture",
    "Watches"
  ];

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      await axios.post("http://localhost:4000/api/category", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Category Added ✅");
    } catch (error) {
      console.log(error);
      alert("Error adding category");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Category</h2>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

        <div className="example-chips">
          {examples.map((ex, i) => (
            <span
              key={i}
              className="chip"
              onClick={() => setName(ex)}
            >
              {ex}
            </span>
          ))}
        </div>

      <br />

      {/* IMAGE */}
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

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