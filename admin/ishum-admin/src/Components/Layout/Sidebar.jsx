import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaTags,
  FaHome,
  FaUser,
  FaChevronDown
} from "react-icons/fa";

import "../../CSS/Sidebar.css";

const Sidebar = () => {

  const [openProducts, setOpenProducts] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);

  return (
    <div className="admin-sidebar">

      <h2 className="admin-sidebar-title">Admin Panel</h2>

      <ul className="admin-sidebar-list">

        {/* Orders */}
        <li>
          <Link to="/orders">
            <FaHome /> Orders
          </Link>
        </li>

        {/* 🔥 ADD DROPDOWN */}
        <li className="admin-sidebar-dropdown">
          <div
            className="admin-sidebar-item"
            onClick={() => setOpenAdd(!openAdd)}
          >
            <FaTags /> Add
            <FaChevronDown className={`chevron ${openAdd ? "rotate" : ""}`} />
          </div>

          {openAdd && (
            <ul className="admin-dropdown-list">
              <li><Link to="/category/add">Add Category</Link></li>
              <li><Link to="/subcategory/add">Add SubCategory</Link></li>
              <li><Link to="/product-type/add">Add Product Type</Link></li>
              <li><Link to="/sub-product-type/add">Add Sub Product Type</Link></li>
            </ul>
          )}
        </li>

        {/* 🔥 MANAGE DROPDOWN */}
        <li className="admin-sidebar-dropdown">
          <div
            className="admin-sidebar-item"
            onClick={() => setOpenManage(!openManage)}
          >
            <FaTags /> Manage
            <FaChevronDown className={`chevron ${openManage ? "rotate" : ""}`} />
          </div>

          {openManage && (
            <ul className="admin-dropdown-list">
              <li><Link to="/category/manage">Manage Category</Link></li>
              <li><Link to="/subcategory/manage">Manage SubCategory</Link></li>
              <li><Link to="/product-type/manage">Manage Product Type</Link></li>
              <li><Link to="/sub-product-type/manage">Manage Sub Product Type</Link></li>
            </ul>
          )}
        </li>

        {/* 🔥 COLLECTION DROPDOWN */}
        <li className="admin-sidebar-dropdown">
          <div
            className="admin-sidebar-item"
            onClick={() => setOpenCollection(!openCollection)}
          >
            <FaTags /> Collection
            <FaChevronDown className={`chevron ${openCollection ? "rotate" : ""}`} />
          </div>

          {openCollection && (
            <ul className="admin-dropdown-list">
              <li><Link to="/collection/add">Add Collection</Link></li>
              <li><Link to="/collection/manage">Manage Collection</Link></li>
            </ul>
          )}
        </li>

        {/* Products */}
        <li className="admin-sidebar-dropdown">
          <div
            className="admin-sidebar-item"
            onClick={() => setOpenProducts(!openProducts)}
          >
            <FaBox /> Products
            <FaChevronDown className={`chevron ${openProducts ? "rotate" : ""}`} />
          </div>

          {openProducts && (
            <ul className="admin-dropdown-list">
              <li><Link to="/products/add-product">Add Product</Link></li>
              <li><Link to="/products/add-product">Product List</Link></li>
              <li><Link to="/manage-products">Manage Products</Link></li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/cart-trigger">Add to Cart Trigger</Link>
        </li>

        <li>
          <Link to="/user-id">All User Login Id</Link>
        </li>

      </ul>

      <div className="admin-sidebar-footer">
        <FaUser /> Admin
      </div>

    </div>
  );
};

export default Sidebar;