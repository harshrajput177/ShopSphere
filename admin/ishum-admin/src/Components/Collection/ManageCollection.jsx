import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/Collection/ManageCollection.css"
import EditModal from "./updateCollModel";

const ManageCollection = () => {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Collections
  const fetchCollections = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/collection");
      setCollections(res.data.collections);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Open Modal
  const handleEdit = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  return (
    <div className="manage-container">

      <h2>Manage Collections</h2>

      <div className="collection-list">
        {collections.map((item) => (
          <div className="collection-card" key={item._id}>
            
            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>

            <p>{item.isFeatured ? "⭐ Featured" : ""}</p>

            <button onClick={() => handleEdit(item)}>
              Edit
            </button>

          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <EditModal
          data={selected}
          onClose={() => setShowModal(false)}
          refresh={fetchCollections}
        />
      )}
    </div>
  );
};

export default ManageCollection;