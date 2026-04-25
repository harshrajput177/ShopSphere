import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // 🔥 FETCH ALL PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      console.log(res.data)
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? ❌")) return;

    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      alert("Deleted ✅");
      fetchProducts(); // refresh
    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  // 🔥 EDIT (redirect)
  const handleEdit = (id) => {
    window.location.href = `/admin/edit-product/${id}`;
  };

  // 🔥 VIEW PRODUCT
  const handleView = (id) => {
    window.open(`/product/${id}`, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Products</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            // 🔥 dynamic price (variant se)
            const allPrices = p.variants?.flatMap(v =>
              v.sizes?.map(s => Number(s.price)) || []
            );

            const price =
              allPrices.length > 0 ? Math.min(...allPrices) : 0;

            return (
              <tr key={p._id}>
                <td>
                  <img
                    src={p?.variants?.[0]?.images?.[0]}
                    alt=""
                    width="60"
                  />
                </td>

                <td>{p.title}</td>

                <td>₹ {price}</td>

                <td>{p?.subCategory?.name || "N/A"}</td>

                <td>
                  <button onClick={() => handleView(p._id)}>
                    👁 View
                  </button>

                  <button onClick={() => handleEdit(p._id)}>
                    ✏ Edit
                  </button>

                  <button onClick={() => handleDelete(p._id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;