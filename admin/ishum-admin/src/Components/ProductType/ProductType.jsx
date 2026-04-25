import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/ProductType/Producttype.css"

const ProductTypeAdd = () => {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [group, setGroup] = useState("");


  const groupOptions = [
  "Topwear",
  "Bottomwear",
  "Innerwear",
  "Co-ord Set",
  "OnePiece",
  "Outerwear",
  "other"
];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Only image files allowed");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  };
  // 🔥 PRODUCT TYPE EXAMPLES
  const examples = [
    "T-Shirt", "Shirt", "Polo T-Shirt", "Hoodie", "Sweatshirt", "Jacket", "Blazer", "Coat", "Sweater", "Cardigan",
    "Jeans", "Trousers", "Shorts", "Joggers", "Track Pant", "Cargo Pants", "Chinos", "Capri",
    "Saree", "Lehenga", "Blouse", "Kurti", "Gown", "Dress", "Skirt", "Crop Top", "Tunic", "Jumpsuit", "Playsuit",
    "Kurta", "Sherwani", "Nehru Jacket", "Dhoti", "Salwar", "Dupatta",
    "Bra", "Panties", "Boxer", "Briefs", "Trunks", "Vest", "Camisole", "Shapewear",
    "Night Suit", "Night Dress", "Robe", "Lounge Set",
    "Gym T-Shirt", "Sports Bra", "Leggings", "Compression Wear",
    "Romper", "Onesie", "Kids Dress", "Kids T-Shirt",
    "Socks", "Stockings", "Gloves", "Scarf", "Cap"
  ];

  // ✅ GET ALL CATEGORIES
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/category");
        setCategories(res.data.categories);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  }, []);

  // ✅ GET SUBCATEGORY WHEN CATEGORY CHANGES
  useEffect(() => {
    const getSubCategories = async () => {
      if (!selectedCategory) return;

      try {
        const res = await axios.get(
          `http://localhost:4000/api/subcategory/category/${selectedCategory}`
        );

        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.log(err);
      }
    };

    getSubCategories();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory("");
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!name || !selectedSubCategory || !group) {
  alert("All fields are required");
  return;
}

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subCategory", selectedSubCategory);
      formData.append("image", image);
      formData.append("group", group);

      await axios.post(
        "http://localhost:4000/api/product-type/create",
        formData
      );

      alert("Product Type Added ✅");

      setName("");
      setImage(null);
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSubCategories([]);
      setGroup("");

    } catch (err) {
      console.log(err);
      alert("Error adding product type");
    }
  };

  return (
    <div className="form-container">

      <h2>Add Product Type</h2>

      <form onSubmit={handleSubmit}>

        {/* CATEGORY */}
        <label>Category</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <label>SubCategory</label>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
        >
          <option value="">Select SubCategory</option>

          {subCategories.length > 0 ? (
            subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))
          ) : (
            <option disabled>Loading or No SubCategory</option>
          )}
        </select>

   <label>Group</label>

<div className="group-checkbox">
  {groupOptions.map((g, i) => (
    <label key={i} className="checkbox-item">
      <input
        type="checkbox"
        checked={group === g}
        onChange={() => setGroup(g)}
      />
      <span>{g}</span>
    </label>
  ))}
</div>

        {/* PRODUCT TYPE NAME */}
        <label>Product Type Name</label>
        <input
          type="text"
          placeholder="Enter product type"
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

        {/* IMAGE */}
        <label>Upload Image</label>

        {!image && (
          <div
            className={`dropzone ${dragActive ? "active" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={(e) => e.currentTarget.querySelector("input").click()}
          >
            <p>
              Drag & Drop image here or <span>Browse</span>
            </p>

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file && file.type.startsWith("image/")) {
                  setImage(file);
                } else {
                  alert("Only image files allowed");
                }
              }}
            />
          </div>
        )}

        {/* PREVIEW */}
        {image && (
          <div className="preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="preview-img"
            />

            <div
              className="remove-btn"
              onClick={() => setImage(null)}
            >
              Remove
            </div>
          </div>
        )}

        <button type="submit">Add Product Type</button>

      </form>
    </div>
  );
};

export default ProductTypeAdd;