import React, { useEffect, useState } from "react";
import axios from "axios";

const AddSubCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // 🔥 FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:4000/api/category");
     setCategories(res.data.categories);
    };

    fetchCategories();
  }, []);

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/api/subcategory",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("SubCategory Added ✅");
      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add SubCategory</h2>

      {/* NAME */}
      <input
        type="text"
        placeholder="SubCategory Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      {/* CATEGORY DROPDOWN */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>

     {categories?.map((cat) => (
  <option key={cat._id} value={cat._id}>
    {cat.name}
  </option>
))}
      </select>

      <br /><br />

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
        Save SubCategory
      </button>
    </div>
  );
};

export default AddSubCategory;