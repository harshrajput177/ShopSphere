import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModelProductType";
import "../../CSS/ProductType/UpdateModel.css"

const ProductTypeManager = () => {

  const [productTypes, setProductTypes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ FETCH DATA
  const fetchProductTypes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product-type");
      setProductTypes(res.data.productTypes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  // ✅ OPEN MODAL
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // ✅ CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="Manageproducttpye-container">

      <h2>Product Types</h2>

      {/* LIST */}
      <div className="Manageproducttpye-grid">
        {productTypes.map((item) => (
          <div key={item._id} className="Manageproducttpye-card">
            <img src={item.image} alt="" />
            <h4>{item.name}</h4>

            <button onClick={() => handleEdit(item)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <UpdateModal
          item={selectedItem}
          closeModal={closeModal}
          refresh={fetchProductTypes}
        />
      )}

    </div>
  );
};

export default ProductTypeManager;