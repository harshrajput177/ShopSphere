import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);
const [productTypes, setProductTypes] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    category: "",
    subCategory: "",
    productType: "",
    tags: [],
    collections: [],
    occasion: []
  });

  const [variants, setVariants] = useState([]);
  const [newImages, setNewImages] = useState({});

  const fetchCategories = async () => {
  const res = await axios.get(
    "http://localhost:4000/api/category"
  );
  setCategories(res.data.categories);
};

const fetchSubCategories = async (categoryId) => {
  const res = await axios.get(
    `http://localhost:4000/api/subcategory?category=${categoryId}`
  );
  setSubcategories(res.data.subCategories);
};

const fetchProductTypes = async (subCategoryId) => {
  const res = await axios.get(
    `http://localhost:4000/api/product-type/subcategory/${subCategoryId}`
  );
  setProductTypes(res.data.productTypes);
};

  // 🔥 MAIN IMAGE SELECT
  const handleMainImage = (vIndex, img) => {
    const updated = [...variants];
    updated[vIndex].mainImage = img;
    setVariants(updated);
  };

  // 🔥 NEW IMAGE SELECT
  const handleImageChange = (e, vIndex) => {
    const files = Array.from(e.target.files);

    setNewImages((prev) => ({
      ...prev,
      [vIndex]: files
    }));
  };

  // 🔥 FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/products/${id}`
      );

      const product = res.data;

      if (product.category) {
  fetchSubCategories(
    product.category?._id || product.category
  );
}

if (product.subCategory) {
  fetchProductTypes(
    product.subCategory?._id || product.subCategory
  );
}

// 🔥 FETCH PRODUCT → setForm update
setForm({
  title: product.title || "",
  description: product.description || "",
  discount: product.discount || "",
  category: product.category?._id || product.category || "",
  subCategory:
    product.subCategory?._id ||
    product.subCategory ||
    "",
  productType:
    product.productType?._id ||
    product.productType ||
    "",
  tags: product.tags || [],
  collections: product.collections || [],
  occasion: product.occasion || []
});

      setVariants(product.variants || []);
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  fetchCategories();

  if (id) {
    fetchProduct();
  }
}, [id]);

  // 🔥 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 TAGS HANDLE
  const handleTags = (e) => {
    setForm({
      ...form,
      tags: e.target.value.split(",")
    });
  };

  // 🔥 SIZE CHANGE
  const handleSizeChange = (vIndex, sIndex, field, value) => {
    const updated = [...variants];
    updated[vIndex].sizes[sIndex][field] = value;
    setVariants(updated);
  };

  // 🔥 UPDATE PRODUCT WITH IMAGE UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // BASIC FIELDS
// 🔥 HANDLE UPDATE → gender remove
formData.append("title", form.title);
formData.append("description", form.description);
formData.append("discount", Number(form.discount));
formData.append("category", form.category);
formData.append("subCategory", form.subCategory);
formData.append("productType", form.productType);
formData.append("tags", JSON.stringify(form.tags));

    // CLEAN VARIANTS
   const cleanedVariants = variants.map((v, index) => ({
  color: v.color,

  // old images preserve
  images: v.images || [],

  // 🔥 mainImage ko force mat karo
  // backend decide karega
  mainImage: v.mainImage || "",

  sizes: (v.sizes || []).map((s) => ({
    size: s.size,
    price: Number(s.price),
    stock: Number(s.stock)
  }))
}));

    formData.append(
      "variants",
      JSON.stringify(cleanedVariants)
    );

    // 🔥 NEW IMAGE UPLOAD
    Object.keys(newImages).forEach((vIndex) => {
      newImages[vIndex].forEach((file) => {
        formData.append(
          `variants[${vIndex}]`,
          file
        );
      });
    });

    try {
      await axios.put(
        `http://localhost:4000/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Updated Successfully ✅");
      navigate("/products/add-product");
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Product: {form.title}</h2>

      <form onSubmit={handleUpdate}>
        {/* BASIC INFO */}
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          placeholder="Title"
        />
        <br /><br />

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
        />
        <br /><br />

        <input
          type="number"
          name="discount"
          value={form.discount || ""}
          onChange={handleChange}
          placeholder="Discount"
        />
        <br /><br />

      <select
  name="category"
  value={form.category}
  onChange={async (e) => {
    const value = e.target.value;

    setForm({
      ...form,
      category: value,
      subCategory: "",
      productType: ""
    });

    await fetchSubCategories(value);
  }}
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

<br /><br />

<select
  name="subCategory"
  value={form.subCategory}
  onChange={async (e) => {
    const value = e.target.value;

    setForm({
      ...form,
      subCategory: value,
      productType: ""
    });

    await fetchProductTypes(value);
  }}
>
  <option value="">Select SubCategory</option>

  {subcategories.map((sub) => (
    <option
      key={sub._id}
      value={sub._id}
    >
      {sub.name}
      {" "}
      (
      {sub.gender?.name}
      )
    </option>
  ))}
</select>

<br /><br />

<select
  name="productType"
  value={form.productType}
  onChange={handleChange}
>
  <option value="">
    Select Product Type
  </option>

  {productTypes.map((pt) => (
    <option
      key={pt._id}
      value={pt._id}
    >
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

        {/* GENDER */}
    

        <br /><br />

        {/* TAGS */}
        <input
          value={form.tags.join(",")}
          onChange={handleTags}
          placeholder="Tags (comma separated)"
        />

        <br /><br />

        {/* VARIANTS */}
        <h3>Variants</h3>

        {variants.map((variant, vIndex) => (
          <div
            key={vIndex}
            style={{
              marginBottom: "30px",
              border: "1px solid #ddd",
              padding: "15px"
            }}
          >
            <strong>{variant.color}</strong>

            <br /><br />

            {/* SIZE UPDATE */}
            {variant.sizes.map((s, sIndex) => (
              <div key={sIndex}>
                <strong>Size:</strong> {s.size}

                <input
                  type="number"
                  value={s.price || ""}
                  onChange={(e) =>
                    handleSizeChange(
                      vIndex,
                      sIndex,
                      "price",
                      e.target.value
                    )
                  }
                  placeholder="Price"
                  style={{ marginLeft: "10px" }}
                />

                <input
                  type="number"
                  value={s.stock || ""}
                  onChange={(e) =>
                    handleSizeChange(
                      vIndex,
                      sIndex,
                      "stock",
                      e.target.value
                    )
                  }
                  placeholder="Stock"
                  style={{ marginLeft: "10px" }}
                />

                <br /><br />
              </div>
            ))}

            {/* OLD IMAGES */}
            <h4>Current Images</h4>

            {variant.images?.map((img, imgIndex) => (
              <img
                key={imgIndex}
                src={img}
                alt=""
                width="90"
                style={{
                  border:
                    variant.mainImage === img
                      ? "3px solid red"
                      : "1px solid #ccc",
                  margin: "5px",
                  cursor: "pointer"
                }}
                onClick={() =>
                  handleMainImage(vIndex, img)
                }
              />
            ))}

            <br /><br />

            {/* NEW IMAGE UPDATE */}
            <h4>Upload New Images</h4>

            <input
              type="file"
              multiple
              onChange={(e) =>
                handleImageChange(e, vIndex)
              }
            />
          </div>
        ))}

        <button type="submit">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;