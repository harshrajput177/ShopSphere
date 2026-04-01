import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductTypeAdd = () => {

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    // ✅ GET ALL CATEGORIES
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/category");
                console.log("Categories:", res.data);
                setCategories(res.data.categories);
            } catch (err) {
                console.log(err);
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
    console.log("🔥 UPDATED subCategories:", subCategories);
}, [subCategories]);


    // ✅ GET SUBCATEGORY WHEN CATEGORY CHANGES
    useEffect(() => {
        const getSubCategories = async () => {
            if (!selectedCategory) return;

            console.log("🔥 Fetching SubCategories for:", selectedCategory);

            try {
                const res = await axios.get(
                    `http://localhost:4000/api/subcategory/category/${selectedCategory}`
                );

                console.log("✅ SubCategories:", res.data);

                console.log("🔥 subCategories state:", subCategories);

                setSubCategories(res.data.subCategories || []);
            } catch (err) {
                console.log("❌ Error:", err);
            }
        };

        getSubCategories();
    }, [selectedCategory]);

    // ✅ HANDLE CATEGORY CHANGE
    const handleCategoryChange = (e) => {
        const id = e.target.value;

        console.log("🔥 Category Changed:", id);

        setSelectedCategory(id);
        setSelectedSubCategory(""); // reset
    };

    // ✅ FORM SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !selectedSubCategory) {
            alert("All fields are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("subCategory", selectedSubCategory);
            formData.append("image", image);

            await axios.post(
                "http://localhost:4000/api/product-type/create",
                formData
            );

            alert("Product Type Added ✅");

            // reset
            setName("");
            setImage(null);
            setSelectedCategory("");
            setSelectedSubCategory("");
            setSubCategories([]);

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

                {/* PRODUCT TYPE NAME */}
                <label>Product Type Name</label>
                <input
                    type="text"
                    placeholder="Enter product type"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* IMAGE UPLOAD */}
                <label>Upload Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button type="submit">Add Product Type</button>

            </form>

        </div>
    );
};

export default ProductTypeAdd;