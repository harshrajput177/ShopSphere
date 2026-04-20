import React, { useEffect, useState } from "react";
import axios from "axios";
import { sizeChartConfig } from "./FashionAttributes/SizeConfig";
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

  const [productName, setProductName] = useState("");
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

  useEffect(() => {
  if (productName && !title) {
    setTitle(productName);
  }
}, [productName]);

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
  const res = await axios.get(`/api/attribute/product/${productTypeId}`);
  setActiveAttributes(res.data);
};

const fetchSizeChart = async (productTypeId) => {
  const res = await axios.get(`/api/sizechart/${productTypeId}`);
  setSizeFields(res.data.fields);
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

  const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, "").replace(/-/g, "").trim();
  

  if (!attrs) {
    const keys = Object.keys(allAttributes);
    const matchedKey = keys.find(key =>
      productKey.includes(normalize(key)) || normalize(key).includes(productKey)
    );

    if (matchedKey) {
      attrs = allAttributes[matchedKey];
    }
  }

  fetchAttributes(id);
  fetchSizeChart(id);
  setAttributesData({});

  // 🔥 SIZE CHART LOGIC ADD
  setSizeChart([]); // reset jab product change ho
};

  const handleAttributeChange = (name, value) => {
    setAttributesData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addVariant = () => {
    if (!color.trim() || variantImages.length === 0 || sizes.length === 0) {
      alert("Add proper color, size & images");
      return;
    }

    setVariants(prev => [
      ...prev,
      {
        color,
        sizes: [...sizes],
        images: [...variantImages],
        mainImage: selectedMainImage // 🔥 yaha save
      }
    ]);

    setColor("");
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
      formData.append("productName", productName);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("productType", productType);
      formData.append("specifications", JSON.stringify(attributesData));
      formData.append("isBestSeller", isBestSeller);
      formData.append("isTrending", isTrending);
      formData.append("isNewArrival", isNewArrival);
      formData.append("isGenZ", isGenZ);
      formData.append("gender", gender);


      collections.forEach(c => formData.append("collections", c));
      tags.forEach(t => formData.append("tags", t));
      occasion.forEach(o => formData.append("occasion", o));


      if (variants.length === 0) {
        alert("Please add at least one variant ⚠️");
        return;
      }

      variants.forEach((variant, i) => {
        formData.append(`variants[${i}][color]`, variant.color);
        formData.append(`variants[${i}][mainImage]`, variant.mainImage);

        variant.sizes.forEach((s, idx) => {
          formData.append(`variants[${i}][sizes][${idx}][size]`, s.size);
          formData.append(`variants[${i}][sizes][${idx}][stock]`, s.stock);
        });

        variant.images.forEach((img) => {
          formData.append(`variants[${i}][images]`, img);
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
    setProductName("");
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
          <input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
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
      {activeAttributes.length > 0 && (
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
                      {attr.options.map((opt, idx) => (
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

        {/* COLOR */}
        <input
          placeholder="Enter Color (Red, Black)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

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
                    setSizes([...sizes, { size, stock: 0, price: 0 }]);
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
                    border: v.mainImage === img ? "3px solid red" : "1px solid gray",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    const updated = [...variants];
                    updated[i].mainImage = img; // 🔥 direct save in variant
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

      {sizeFields.length > 0 && (
  <div className="card">
    <h3>Size Chart</h3>

    <button onClick={addSizeRow}>+ Add Size</button>

    {sizeChart.map((row, i) => (
      <div key={i} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        
        {/* SIZE */}
        <input
          placeholder="Size (M)"
          value={row.size}
          onChange={(e) => {
            const updated = [...sizeChart];
            updated[i].size = e.target.value;
            setSizeChart(updated);
          }}
        />

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































































































































































