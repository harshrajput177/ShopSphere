import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateSizeChart = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [productType, setProductType] = useState("");
  const [fields, setFields] = useState("");

  // 🔥 GET PRODUCT TYPES
  useEffect(() => {
    axios.get("http://localhost:4000/api/product-type")
      .then(res => setProductTypes(res.data.productTypes))
      .catch(err => console.log(err));
  }, []);

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/sizechart/create", {
        productType,
        fields: fields.split(",")
      });

      alert("Size Chart Created ✅");

      setFields("");
      setProductType("");

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Size Chart</h2>

      <form onSubmit={handleSubmit}>
        {/* PRODUCT TYPE */}
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="">Select Product Type</option>
          {productTypes.map(pt => (
            <option key={pt._id} value={pt._id}>
              {pt.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* FIELDS INPUT */}
        <input
          type="text"
          placeholder="Enter fields (Waist,Length,Chest)"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateSizeChart;