import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageAttributes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [attributes, setAttributes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "text",
    options: "",
    productTypes: "",
    isSize: false,
  });

  const [editingId, setEditingId] = useState(null);

  // 🔥 Load Product Types
  useEffect(() => {
    axios.get("http://localhost:4000/api/product-type")
      .then(res => setProductTypes(res.data.productTypes))
      .catch(err => console.log(err));
  }, []);

  // 🔥 Fetch Attributes by ProductType
  const fetchAttributes = async () => {
    if (!selectedProductType) return alert("Select Product Type");

    const res = await axios.get(
      `http://localhost:4000/api/attribute/product/${selectedProductType}`
    );

    setAttributes(res.data);
  };

  // 🔥 Edit
  const handleEdit = (attr) => {
    setForm({
      name: attr.name,
      type: attr.type,
      options: attr.options?.join(",") || "",
      productTypes: attr.productTypes[0] || "",
      isSize: attr.isSize || false
    });

    setEditingId(attr._id);
  };

  // 🔥 Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      options: form.options ? form.options.split(",") : [],
      productTypes: [selectedProductType]
    };

    await axios.put(
      `http://localhost:4000/api/attribute/update/${editingId}`,
      payload
    );

    alert("Updated ✅");
    setEditingId(null);

    fetchAttributes();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Attributes</h2>

      {/* 🔥 PRODUCT TYPE SELECT */}
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

      <button onClick={fetchAttributes}>Load</button>

      <hr />

      {/* 🔥 ATTRIBUTE LIST */}
      <ul>
        {attributes.map((attr) => (
          <li key={attr._id}>
            <strong>{attr.name}</strong> ({attr.type})

            {attr.options?.length > 0 && (
              <div>{attr.options.join(", ")}</div>
            )}

            <button onClick={() => handleEdit(attr)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* 🔥 EDIT FORM */}
      {editingId && (
        <>
          <h3>Edit Attribute</h3>

          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="number">Number</option>
            </select>

            {form.type === "select" && (
              <input
                type="text"
                value={form.options}
                onChange={(e) =>
                  setForm({ ...form, options: e.target.value })
                }
              />
            )}

            <label>
              <input
                type="checkbox"
                checked={form.isSize}
                onChange={(e) =>
                  setForm({ ...form, isSize: e.target.checked })
                }
              />
              Is Size
            </label>

            <button type="submit">Update</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ManageAttributes;