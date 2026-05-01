import React, { useEffect, useState } from "react";
import axios from "axios";

const AddGender = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/category"
        );

        setCategories(res.data.categories || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // SUBMIT
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/api/gender",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);
      alert("Gender Added Successfully ✅");

      // RESET
      setName("");
      setCategory("");
      setImage(null);

    } catch (error) {
      console.log(error);
      alert("Failed to Add Gender ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Gender</h2>

      {/* NAME */}
      <select
        value={name}
        onChange={(e) => setName(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
        <option value="Unisex">Unisex</option>
      </select>

      <br /><br />

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
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

      <br /><br />

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
        Save Gender
      </button>
    </div>
  );
};

export default AddGender;