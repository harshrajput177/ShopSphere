import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateSizeChart = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [existingCharts, setExistingCharts] = useState([]);

  const [productType, setProductType] = useState("");
  const [gender, setGender] = useState("");
  const [fields, setFields] = useState("");

  // edit mode
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productTypeRes = await axios.get(
        "http://localhost:4000/api/product-type"
      );

      const genderRes = await axios.get(
        "http://localhost:4000/api/gender"
      );

      const sizeChartRes = await axios.get(
        "http://localhost:4000/api/sizechart/all"
      );

      setProductTypes(productTypeRes.data.productTypes || []);
      setGenders(genderRes.data.genders || []);
      setExistingCharts(sizeChartRes.data.charts || []);

    } catch (err) {
      console.log(err);
    }
  };

  // submit (create + update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gender || !productType || !fields.trim()) {
      alert("All fields are required ⚠️");
      return;
    }

    const payload = {
      gender,
      productType,
      fields: fields
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      // same route create/update dono handle kar raha hai
      if (editId) {
        await axios.put(
          `http://localhost:4000/api/sizechart/update/${editId}`,
          payload
        );
      } else {
        await axios.post(
          "http://localhost:4000/api/sizechart/create",
          payload
        );
      }

      alert(
        editId
          ? "Size Chart Updated Successfully ✅"
          : "Size Chart Created Successfully ✅"
      );

      resetForm();
      fetchData();

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  const resetForm = () => {
    setGender("");
    setProductType("");
    setFields("");
    setEditId(null);
  };

  // edit click
  const handleEdit = (chart) => {
    setEditId(chart._id);

    setGender(
      chart.gender?._id || chart.gender || ""
    );

    setProductType(
      chart.productType?._id || chart.productType || ""
    );

    setFields(
      chart.fields?.join(", ") || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        {editId
          ? "Edit Size Chart"
          : "Create Size Chart"}
      </h2>

      <form onSubmit={handleSubmit}>

        {/* GENDER */}
        <label>Select Gender</label>
        <br />

        <select
          value={gender}
         onChange={(e) => {
  setGender(e.target.value);
  setProductType("")
         }}
        >
          <option value="">Select Gender</option>

          {genders.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name} ({g.category?.name})
            </option>
          ))}
        </select>

        <br /><br />

        {/* PRODUCT TYPE */}
        <label>Select Product Type</label>
        <br />

        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="">Select Product Type</option>

          {productTypes
            .filter((pt) =>
              (
                pt.subCategory?.gender?._id ||
                pt.subCategory?.gender
              ) === gender
            )
            .map((pt) => (
              <option key={pt._id} value={pt._id}>
                {pt.name}
                {" "}
                (
                {pt.subCategory?.name}
                {" - "}
                {pt.subCategory?.gender?.name}
                )
              </option>
            ))}
        </select>

        <br /><br />

        {/* FIELDS */}
        <label>Size Fields</label>
        <br />

        <input
          type="text"
          placeholder="Waist, Hip, Length"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          style={{
            width: "400px",
            padding: "10px"
          }}
        />

        <p style={{ fontSize: "13px", color: "#666" }}>
          Example: Waist, Hip, Length, Chest
        </p>

        <br />

        <button type="submit">
          {editId ? "Update Size Chart" : "Create Size Chart"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Existing Charts */}
      <div style={{ marginTop: "50px" }}>
        <h2>Existing Size Charts</h2>

        {existingCharts.length === 0 ? (
          <p>No Size Charts Found</p>
        ) : (
          <div>
            {existingCharts.map((chart) => (
              <div
                key={chart._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "10px"
                }}
              >
                <h4>
                  {chart.productType?.name}
                  {" "}
                  (
                  {chart.gender?.name}
                  )
                </h4>

                <p>
                  <b>SubCategory:</b>
                  {" "}
                  {chart.productType?.subCategory?.name}
                </p>

                <p>
                  <b>Fields:</b>
                  {" "}
                  {chart.fields?.join(", ")}
                </p>

                <button
                  onClick={() => handleEdit(chart)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSizeChart;