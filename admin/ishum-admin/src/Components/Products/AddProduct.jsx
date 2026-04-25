import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/AddProduct.css";

const AddProduct = () => {

  // 🔥 STATES
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productType, setProductType] = useState("");

  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  const [variants, setVariants] = useState([]);
  const [color, setColor] = useState("");
  const [variantImages, setVariantImages] = useState([]);

  const [showGender, setShowGender] = useState(false);
  const [gender, setGender] = useState("");
  const [selectedMainImage, setSelectedMainImage] = useState(null);
const [selectedMainImageIndex, setSelectedMainImageIndex] = useState(null);
  const [activeAttributes, setActiveAttributes] = useState([]);
  const [attributesData, setAttributesData] = useState({});
  const [sizes, setSizes] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isGenZ, setIsGenZ] = useState(false);
  const [occasion, setOccasion] = useState([]);
  const [sizeChart, setSizeChart] = useState([]);
  const [sizeFields, setSizeFields] = useState([]);

  const [loading, setLoading] = useState(false);

  const tagOptions = [
    "Best Seller",
    "Trending",
    "New Arrival",
    "Hot Deal",
    "Top Rated"
  ];

  const occasionOptions = [
    "Casual",
    "Party",
    "Wedding",
    "Festive",
    "Travel",
    "Sports",
    "Office"
  ];

  // 🔥 FETCH INITIAL DATA
  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, []);

  const sizeAttribute =
    activeAttributes.find(attr => attr.isSize) ||
    activeAttributes.find(attr =>
      attr.name.toLowerCase().includes("size")
    );

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:4000/api/category");
    setCategories(res.data.categories);
  };

  const fetchCollections = async () => {
    const res = await axios.get("http://localhost:4000/api/collection");
    setCollectionsList(res.data.collections);
  };

  const fetchAttributes = async (productTypeId) => {
    console.log("CALLING API WITH:", productTypeId);
    const res = await axios.get(
      `http://localhost:4000/api/attribute/product/${productTypeId}`
    );
    setActiveAttributes(res.data);
  };



  // 🔥 functions section (useEffect ke niche rakh)
  const fetchSizeChart = async (productTypeId) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/sizechart/${productTypeId}`
      );

      setSizeFields(res.data.fields || []);
    } catch (err) {
      console.log(err);
      setSizeFields([]);
    }
  };

  const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, "").trim();

  const handleCategory = async (id) => {
    setCategory(id);
    setSubcategory("");
    setProductType("");
    setProductTypes([]);

    const selectedCategory = categories.find(c => c._id === id);

    const name = normalize(selectedCategory?.name);

    // 🔥 SMART MATCH
    if (
      name.includes("cloth") ||   // clothing, clothes, cloth
      name.includes("beauty")
    ) {
      setShowGender(true);
    } else {
      setShowGender(false);
      setGender("");
    }

    const res = await axios.get(`http://localhost:4000/api/subcategory?category=${id}`);
    setSubcategories(res.data.subCategories);
  };

  const handleSubCategory = async (id) => {
    setSubcategory(id);
    console.log("SELECTED SUBCATEGORY:", id);
    setProductType("");
    setProductTypes([]);
    const res = await axios.get(`http://localhost:4000/api/product-type/subcategory/${id}`);
    setProductTypes(res.data.productTypes);
  };


  const handleProductType = (id) => {
    setProductType(id);

    const selectedProduct = productTypes.find(p => p._id === id);

    if (!selectedProduct) {
      setActiveAttributes([]);
      setSizeFields([]);
      return;
    }

    // 🔥 IMPORTANT CALLS
    fetchAttributes(id);
    fetchSizeChart(id);

    setAttributesData({});
    setSizeChart([]);
  };

  const handleAttributeChange = (name, value) => {
    setAttributesData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addVariant = () => {
    // 🔥 Attribute se color uthao
    const selectedColor = attributesData["Color"];

    // 🔥 Validation
    if (!selectedColor || variantImages.length === 0 || sizes.length === 0) {
      alert("Select color, size & images ⚠️");
      return;
    }

    if (sizes.some(s => !s.price || Number(s.price) <= 0)) {
  alert("Enter price for all selected sizes ⚠️");
  return;
}

    // 🔥 Duplicate color check
    if (variants.some(v => v.color === selectedColor)) {
      alert("This color already added ❌");
      return;
    }

    // 🔥 Variant add
    setVariants(prev => [
      ...prev,
      {
        color: selectedColor, // 👉 yaha auto color aa raha
        sizes: [...sizes],
        images: [...variantImages],
        mainImageIndex: 0
      }
    ]);

    // reset
    setVariantImages([]);
    setSizes([]);
  };

  const addSizeRow = () => {
    setSizeChart([
      ...sizeChart,
      { size: "", values: {} }
    ]);
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("discount", discount);
      formData.append("description", description);
      formData.append("stock", Number(stock));
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("productType", productType);
      formData.append("specifications", JSON.stringify(attributesData));
      formData.append("isBestSeller", isBestSeller);
      formData.append("isTrending", isTrending);
      formData.append("isNewArrival", isNewArrival);
      formData.append("isGenZ", isGenZ);
      formData.append("gender", gender);
      formData.append("sizeChart", JSON.stringify(sizeChart));


      collections.forEach(c => formData.append("collections", c));
      tags.forEach(t => formData.append("tags", t));
      occasion.forEach(o => formData.append("occasion", o));

    const allPrices = variants.flatMap(v =>
  v.sizes
    .map(s => Number(s.price))
    .filter(p => p > 0)
);

      const minPrice = Math.min(...allPrices);

      formData.append("price", minPrice);

      if (variants.some(v => v.mainImageIndex === null || v.mainImageIndex === undefined)) {
  alert("Please select main image ⚠️");
  return;
}


      if (variants.length === 0) {
        alert("Please add at least one variant ⚠️");
        return;
      }

      formData.append("variants", JSON.stringify(variants));

variants.forEach((variant, i) => {
  variant.images.forEach((img) => {
    formData.append(`variants[${i}]`, img);
  });
});

      await axios.post("http://localhost:4000/api/products", formData);

      alert("Product Added 🚀");
      resetForm();
      console.log("FINAL VARIANTS:", variants);

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };


  // ✅ RESET FIX
  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setCategory("");
    setSubcategory("");
    setProductType("");
    setCollections([]);
    setTags([]);
    setVariants([]);
    setColor("");
    setVariantImages([]);
    setOccasion([]);
  };

  return (
    <div className="add-product">

      <h2 className="page-title">Add New Product</h2>

      {/* ===== CATEGORY SECTION ===== */}
      <div className="card">
        <h3>Category Details</h3>

        <div className="grid">
          <select onChange={(e) => handleCategory(e.target.value)}>
            <option>Select Category</option>
            {categories?.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {showGender && (
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
          )}
          <select onChange={(e) => handleSubCategory(e.target.value)}>
            <option>Select SubCategory</option>
            {subcategories?.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>

          <select onChange={(e) => handleProductType(e.target.value)}>
            <option>Select Product Type</option>
            {productTypes?.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

        </div>

        <div className="collection-tags">
          {collectionsList?.map((c) => (
            <div
              key={c._id}
              className={`collection-tag ${collections.includes(c._id) ? "active" : ""}`}
              onClick={() => {
                if (collections.includes(c._id)) {
                  setCollections(collections.filter(id => id !== c._id));
                } else {
                  setCollections([...collections, c._id]);
                }
              }}
            >
              {c.name}
            </div>
          ))}
        </div>

      </div>

      {/* ===== PRODUCT INFO ===== */}
      <div className="card">
        <h3>Product Info</h3>

        <div className="grid">
          <input placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" placeholder="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />

        </div>

        <textarea className="card-description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="card">
        <h3>Product Flags</h3>

        <div className="flags">
          <label>
            <input
              type="checkbox"
              onChange={(e) => setIsBestSeller(e.target.checked)}
            />
            Best Seller
          </label>

          <label>
            <input
              type="checkbox"
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            Trending
          </label>

          <label>
            <input
              type="checkbox"
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            New Arrival
          </label>

          <label>
            <input
              type="checkbox"
              onChange={(e) => setIsGenZ(e.target.checked)}
            />
            GenZ
          </label>
        </div>
      </div>

      {/* ===== ATTRIBUTES SECTION ===== */}
      {activeAttributes?.length > 0 && (
        <div className="card">
          <h3>Product Attributes</h3>

          <div className="attribute-grid">
            {activeAttributes
              .filter(attr => !attr.name.toLowerCase().includes("size"))
              .map((attr, i) => (
                <div className="attribute-item" key={i}>
                  <label className="attr-label">{attr.name}</label>

                  {attr.type === "select" ? (
                    <select
                      className="attr-input"
                      value={attributesData[attr.name] || ""}
                      onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                    >
                      <option value="">Select {attr.name}</option>
                      {attr.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="attr-input"
                      type={attr.type}
                      placeholder={`Enter ${attr.name}`}
                      value={attributesData[attr.name] || ""}
                      onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===== TAGS ===== */}
      <div className="card">
        <h3>Tags</h3>

        <div className="tags">
          {tagOptions.map(tag => (
            <div
              key={tag}
              className={`tag ${tags.includes(tag) ? "active" : ""}`}
              onClick={() => {
                if (tags.includes(tag)) {
                  setTags(tags.filter(t => t !== tag));
                } else {
                  if (!tags.includes(tag)) {
                    setTags([...tags, tag]);
                  }
                }
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Occasion</h3>

        <div className="tags">
          {occasionOptions.map(o => (
            <div
              key={o}
              className={`tag ${occasion.includes(o) ? "active" : ""}`}
              onClick={() => {
                if (occasion.includes(o)) {
                  setOccasion(occasion.filter(item => item !== o));
                } else {
                  setOccasion([...occasion, o]);
                }
              }}
            >
              {o}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Add Color Variants</h3>


        <div className="size-options">
          {sizeAttribute?.options?.map((size) => (
            <div
              key={size}
              className={`size-item ${sizes.some(s => s.size === size) ? "active" : ""
                }`}
            >
              <input
                type="checkbox"
                checked={sizes.some(s => s.size === size)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSizes([...sizes, { size, stock: 0, price: "" }]);
                  } else {
                    setSizes(sizes.filter(s => s.size !== size));
                  }
                }}
              />

              <span>{size}</span>

              {sizes.some(s => s.size === size) && (
                <div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={sizes.find(s => s.size === size)?.stock || ""}
                    onChange={(e) => {
                      setSizes(
                        sizes.map(s =>
                          s.size === size
                            ? { ...s, stock: e.target.value }
                            : s
                        )
                      );
                    }}
                    style={{ width: "80px", marginLeft: "10px" }}
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={sizes.find(s => s.size === size)?.price || ""}
                    onChange={(e) => {
                      setSizes(
                        sizes.map(s =>
                          s.size === size
                            ? { ...s, price: e.target.value }
                            : s
                        )
                      );
                    }}
                    style={{ width: "80px", marginLeft: "10px" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* IMAGES */}
        <input
          type="file"
          multiple
          onChange={(e) => setVariantImages(Array.from(e.target.files))}
        />

        <button onClick={addVariant}>
          Add Variant
        </button>

        {/* PREVIEW */}
        <div className="preview-grid">
          {variants.map((v, i) => (
            <div key={i} className="variant-box">
              <p><b>{v.color}</b></p>

              {/* SHOW SIZES */}
              <div>
                {v.sizes?.map((s, idx) => (
                  <span key={idx} className="size-badge">
                    {s.size} ({s.stock})
                  </span>
                ))}
              </div>

              {v.images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  width="60"
                  style={{
                   border: v.mainImageIndex === idx ? "3px solid red" : "1px solid gray",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                     const updated = [...variants];
  updated[i].mainImageIndex = idx;
  setVariants(updated);
                  }}
                />
              ))}

              <button onClick={() => {
                setVariants(prev => prev.filter((_, index) => index !== i));
              }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      {sizeFields?.length > 0 && (
        <div className="card">
          <h3>Size Chart</h3>

          <button onClick={addSizeRow}>+ Add Size</button>

          {sizeChart.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

              {/* SIZE */}
              <select
                value={row.size}
                onChange={(e) => {
                  const updated = [...sizeChart];
                  updated[i].size = e.target.value;
                  setSizeChart(updated);
                }}
              >
                <option value="">Select Size</option>

                {sizeAttribute?.options
                  ?.filter(size => !sizeChart.some(r => r.size === size)) // duplicate block
                  .map((size, idx) => (
                    <option key={idx} value={size}>
                      {size}
                    </option>
                  ))}
              </select>

              {/* 🔥 DYNAMIC FIELDS */}
              {sizeFields.map((field, idx) => (
                <input
                  key={idx}
                  placeholder={field}
                  onChange={(e) => {
                    const updated = [...sizeChart];
                    updated[i].values = {
                      ...updated[i].values,
                      [field]: e.target.value
                    };
                    setSizeChart(updated);
                  }}
                />
              ))}

              {/* REMOVE */}
              <button onClick={() => {
                setSizeChart(sizeChart.filter((_, index) => index !== i));
              }}>
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ===== SUBMIT ===== */}
      <button className="submit-btn" onClick={handleSubmit}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
};
export default AddProduct;































































































































































