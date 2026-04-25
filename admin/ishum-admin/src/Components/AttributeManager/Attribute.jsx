import React, { useState, useEffect } from "react";
import axios from "axios";

const AttributeManager = () => {
  const [form, setForm] = useState({
    name: "",
    type: "text",
    options: "",
    productTypes: "",
  isSize: false
  });

  const [attributes, setAttributes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [editingId, setEditingId] = useState(null);


  // 🔥 GET ALL PRODUCT TYPES
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/product-type");
        console.log(res.data);
        setProductTypes(res.data.productTypes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductTypes();
  }, []);



  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 🔥 CREATE ATTRIBUTE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const payload = {
  ...form,
  options: form.options ? form.options.split(",") : [],
  productTypes: [form.productTypes]
};

      await axios.post("http://localhost:4000/api/attribute/create", payload);

      alert("Attribute Created ✅");
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

 
const fetchAttributes = async () => {
  if (!selectedProductType) {
    return alert("Select Product Type");
  }

  const res = await axios.get(
    `http://localhost:4000/api/attribute/product/${selectedProductType}`
  );

  setAttributes(res.data);
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Attribute</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Attribute Name"
          value={form.name}
          onChange={handleChange}
        />

        <br /><br />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="text">Text</option>
          <option value="select">Select</option>
          <option value="number">Number</option>
        </select>

        <br /><br />

        {form.type === "select" && (
          <>
            <input
              type="text"
              name="options"
              placeholder="Options (S,M,L)"
              value={form.options}
              onChange={handleChange}
            />
            <br /><br />
          </>
        )}

        {form.type === "number" && (
  <>
    <input
      type="number"
      name="numberValue"
      placeholder="Enter number (e.g. 6 pockets)"
      value={form.numberValue || ""}
      onChange={handleChange}
    />
    <br /><br />
  </>
)}

        {/* 🔥 PRODUCT TYPE DROPDOWN */}
        <select
          name="productTypes"
          value={form.productTypes}
          onChange={handleChange}
        >
          <option value="">Select Product Type</option>
          {productTypes.map((pt) => (
            <option key={pt._id} value={pt._id}>
              {pt.name}
            </option>
          ))}
        </select>


        <br /><br />

        <label>
          <input
            type="checkbox"
            name="isSize"
            checked={form.isSize}
            onChange={handleChange}
          />
          Is Size
        </label>

        <br /><br />

        <button type="submit">Create</button>
      </form>

      <hr />

      <h2>Get Attributes</h2>

      {/* 🔥 NAME BASED DROPDOWN */}
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


      <button onClick={fetchAttributes}>Fetch</button>

      <ul>
        {attributes.map((attr) => (
          <li key={attr._id}>
            <strong>{attr.name}</strong> ({attr.type})
            {attr.options?.length > 0 && (
              <div>{attr.options.join(", ")}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeManager;