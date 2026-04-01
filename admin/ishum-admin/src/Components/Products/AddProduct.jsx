import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/AddProduct.css";

const AddProduct = () => {

  // 🔥 STATES
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [subProductTypes, setSubProductTypes] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productType, setProductType] = useState("");
  const [subProductType, setSubProductType] = useState("");

  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");

  const [frontImage, setFrontImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [colorImages, setColorImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const tagOptions = [
  "Best Seller",
  "Trending",
  "New Arrival",
  "Limited Edition",
  "Hot Deal",
  "Premium",
  "Budget Pick",
  "Top Rated"
];

  // 🔥 FETCH INITIAL DATA
  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:4000/api/category");
    setCategories(res.data.categories);
  };

  const fetchCollections = async () => {
    const res = await axios.get("http://localhost:4000/api/collection");
    setCollectionsList(res.data.collections);
  };

  // 🔥 HANDLERS
  const handleCategory = async (id) => {
    setCategory(id);
    setSubcategory("");
    const res = await axios.get(`http://localhost:4000/api/subcategory?category=${id}`);
    setSubcategories(res.data.subCategories);
  };

  const handleSubCategory = async (id) => {
    setSubcategory(id);
    const res = await axios.get(`http://localhost:4000/api/product-type?subCategory=${id}`);
    setProductTypes(res.data.productTypes);
  };


const handleProductType = async (id) => {
  try {
    setProductType(id);
    setSubProductTypes([]); // reset

    const res = await axios.get(
      `http://localhost:4000/api/sub-product-type?productType=${id}`
    );

    console.log("API DATA:", res.data); // 🔥

    setSubProductTypes(res.data.subProductTypes || []);

  } catch (err) {
    console.log(err);
    setSubProductTypes([]);
  }
};
 

const handleTag = (e) => {
  const value = e.target.value;

  if (e.target.checked) {
    setTags((prev) => [...prev, value]);
  } else {
    setTags((prev) => prev.filter((t) => t !== value));
  }
};

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (type === "front") setFrontImage(files[0]);
    if (type === "thumb") setThumbnails(prev => [...prev, ...files].slice(0, 5));
    if (type === "color") setColorImages(prev => [...prev, ...files].slice(0, 4));
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("description", description);

      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("productType", productType);
      formData.append("subProductType", subProductType);

      collections.forEach(c => formData.append("collections", c));
      tags.forEach(t => formData.append("tags", t));

      if (frontImage) formData.append("front", frontImage);
      thumbnails.forEach(img => formData.append("thumbnails", img));
      colorImages.forEach(img => formData.append("colors", img));

      await axios.post("http://localhost:4000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Product Added 🚀");
      resetForm();

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDiscount(0);
    setDescription("");
    setCategory("");
    setSubcategory("");
    setProductType("");
    setSubProductType("");
    setCollections([]);
    setTags([]);
    setFrontImage(null);
    setThumbnails([]);
    setColorImages([]);
  };

  return (
    <div className="add-product-wrapper">

      <h2>Add Product</h2>

      {/* CATEGORY */}
      <select onChange={(e) => handleCategory(e.target.value)}>
        <option>Select Category</option>
        {categories?.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* SUBCATEGORY */}
      <select onChange={(e) => handleSubCategory(e.target.value)}>
        <option>Select SubCategory</option>
        {subcategories?.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      {/* PRODUCT TYPE */}
      <select onChange={(e) => handleProductType(e.target.value)}>
        <option>Select Product Type</option>
        {productTypes?.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* SUB PRODUCT TYPE */}
      <select onChange={(e) => setSubProductType(e.target.value)}>
        <option>Select Sub Product Type</option>
     {subProductTypes?.length > 0 ? (
  subProductTypes.map(sp => (
    <option key={sp._id} value={sp._id}>{sp.name}</option>
  ))
) : (
  <option>No Data</option>
)}
      </select>

      {/* COLLECTION */}
      <select multiple onChange={(e) => {
        const val = Array.from(e.target.selectedOptions, o => o.value);
        setCollections(val);
      }}>
        {collectionsList?.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* TITLE */}
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

      {/* PRICE */}
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

      {/* DISCOUNT */}
      <input type="number" placeholder="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />

      {/* DESCRIPTION */}
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />


<div className="tags-wrapper">

  <label className="tag-title">Product Tags</label>

  <div className="tags-grid">
    {tagOptions.map((tag) => (
      <label key={tag} className="tag-item">
        <input
          type="checkbox"
          value={tag}
          checked={tags.includes(tag)}
          onChange={handleTag}
        />
        <span>{tag}</span>
      </label>
    ))}
  </div>

</div>

      {/* FRONT IMAGE */}
      <input type="file" onChange={(e) => setFrontImage(e.target.files[0])} />
      {frontImage && <button onClick={() => setFrontImage(null)}>Remove</button>}

      {/* THUMBNAILS */}
      <input type="file" multiple onChange={(e) => setThumbnails(Array.from(e.target.files))} />
      {thumbnails.map((img, i) => (
        <div key={i}>
          <img src={URL.createObjectURL(img)} alt="" width="50" />
          <button onClick={() => setThumbnails(prev => prev.filter((_, idx) => idx !== i))}>❌</button>
        </div>
      ))}

      {/* COLOR IMAGES */}
      <input type="file" multiple onChange={(e) => setColorImages(Array.from(e.target.files))} />
      {colorImages.map((img, i) => (
        <div key={i}>
          <img src={URL.createObjectURL(img)} alt="" width="50" />
          <button onClick={() => setColorImages(prev => prev.filter((_, idx) => idx !== i))}>❌</button>
        </div>
      ))}

      {/* SUBMIT */}
      <button onClick={handleSubmit}>
        {loading ? "Adding..." : "Add Product"}
      </button>

    </div>
  );
};

export default AddProduct;































































































































































