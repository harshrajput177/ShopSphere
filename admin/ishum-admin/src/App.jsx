import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrdersDashboard from './Components/Orders/Orders';
import Sidebar from './Components/Layout/Sidebar';
import AddProduct from './Components/Products/AddProduct';

import './CSS/Styles.css';
import Header from './Components/Layout/Header';
import AddCategory from './Components/Category/Category';
import AddSubCategory from './Components/Subcategory/Subcatgory';
import ProductTypeAdd from './Components/ProductType/ProductType';
import AddCollection from './Components/Collection/Collection';
import AddBanner from './Components/Banner/AddBanner';
// import UpdateProductType from './Components/ProductType/ManageProducttype';
import TestFetch from './Components/ProductType/ManageProducttype';
import ManageCollection from './Components/Collection/ManageCollection';
import AttributeManager from './Components/AttributeManager/Attribute';
import ManageSubCategory from './Components/Subcategory/ManageSubcategory';
import ManageAttributes from './Components/AttributeManager/Manageattribute';
import CreateSizeChart from './Components/AttributeManager/SizeChart';
import ProductList from './Components/Products/ProductList';
import EditProduct from './Components/Products/EditProduct';

const App = () => {
  return (
    <Router>

      <div className="app-container">

        {/* Sidebar */}
        <Sidebar />

        {/* Right Side */}
        <div className="main-content">

          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="page-content">

            <Routes>
              <Route path="/" element={<OrdersDashboard />} />
    
              <Route path="/products/add-product" element={<AddProduct />} />
              <Route path="/category/add" element={<AddCategory />} />
              <Route path="/subcategory/add" element={<AddSubCategory />} />
                <Route path="/product-type/add" element={<ProductTypeAdd />} />
       
                  <Route path="/collection/add" element={<AddCollection />} />
                   <Route path="/banner/add" element={<AddBanner />} />
                      <Route path="/product-type/manage" element={<TestFetch />} />
                         <Route path="/collection/manage" element={<ManageCollection />} />
                            <Route path="/attribute/add" element={<AttributeManager />} />
                            <Route path="/subcategory/manage" element={<ManageSubCategory/>} />

                            <Route path="/attribute/manage" element={<ManageAttributes/>} />
                              <Route path="/SizeChart/add" element={<CreateSizeChart/>} />
                                   <Route path="/manage-products" element={<ProductList/>} />
                                   <Route path="/admin/edit-product/:id" element={<EditProduct/>} />
            </Routes>

          </div>

        </div>

      </div>

    </Router>
  );
};

export default App;