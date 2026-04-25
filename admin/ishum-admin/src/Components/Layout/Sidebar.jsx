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
  const [openBanner, setOpenBanner] = useState(false);

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
              <li><Link to="/attribute/add">Add Attribute</Link></li>
                 <li><Link to="/SizeChart/add">Add SizeChart</Link></li>
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
              <li><Link to="/category/manage">Category List</Link></li>
              <li><Link to="/subcategory/manage">SubCategory List</Link></li>
              <li><Link to="/product-type/manage">Product Type List</Link></li>
              <li><Link to="/attribute/manage">Attribute List</Link></li>
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
              <li><Link to="/manage-products">Product List</Link></li>
            </ul>
          )}
        </li>
        {/* 🔥 BANNER DROPDOWN */}
        <li className="admin-sidebar-dropdown">
          <div
            className="admin-sidebar-item"
            onClick={() => setOpenBanner(!openBanner)}
          >
            <FaTags /> Banner
            <FaChevronDown className={`chevron ${openBanner ? "rotate" : ""}`} />
          </div>

          {openBanner && (
            <ul className="admin-dropdown-list">
              <li><Link to="/banner/add">Add Banner</Link></li>
              <li><Link to="/banner/manage">Manage Banner</Link></li>
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