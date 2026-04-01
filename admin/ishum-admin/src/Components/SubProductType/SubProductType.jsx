import React, { useEffect, useState } from "react";
import axios from "axios";

const SubProductTypeAdd = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const [productTypes, setProductTypes] = useState([]);
  const [collections, setCollections] = useState([]);

  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");

  // ✅ GET PRODUCT TYPES
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/product-type");
        setProductTypes(res.data.productTypes || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProductTypes();
  }, []);

  // ✅ GET COLLECTIONS
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/collection");
        setCollections(res.data.collections || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCollections();
  }, []);

  // ✅ SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !selectedProductType || !selectedCollection) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("productType", selectedProductType);
      formData.append("collection", selectedCollection);
      formData.append("image", image);

      await axios.post(
        "http://localhost:4000/api/sub-product-type/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Sub Product Type Added ✅");

      // RESET
      setName("");
      setImage(null);
      setSelectedProductType("");
      setSelectedCollection("");

    } catch (err) {
      console.log(err);
      alert("Error adding Sub Product Type ❌");
    }
  };

  return (
    <div className="form-container" style={{ padding: "20px" }}>
      <h2>Add Sub Product Type</h2>

      <form onSubmit={handleSubmit}>

        {/* PRODUCT TYPE */}
        <label>Product Type</label>
        <select
          value={selectedProductType}
          onChange={(e) => setSelectedProductType(e.target.value)}
        >
          <option value="">Select Product Type</option>
          {productTypes.map((pt) => (
            <option key={pt._id} value={pt._id}>
              {pt.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* COLLECTION */}
        <label>Collection</label>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select Collection</option>
          {collections.map((col) => (
            <option key={col._id} value={col._id}>
              {col.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* NAME */}
        <label>Sub Product Type Name</label>
        <input
          type="text"
          placeholder="Enter name (e.g. Gown, Top, Skirt)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        {/* IMAGE */}
        <label>Upload Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">Add Sub Product Type</button>
      </form>
    </div>
  );
};

export default SubProductTypeAdd;