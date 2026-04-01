import React from 'react';
import '../../Style-CSS/MyProfile-css/SideBar.css';

function Sidebar({ activeTab, setActiveTab }) {
  const menu = ['Address', 'Voucher', 'My Wishlist', 'Rate Us'];

  return (
    <div className="User-profile-sidebar">
      {menu.map(item => (
        <div
          key={item}
          className={`User-profile-sidebar-item ${activeTab === item ? 'active' : ''}`}
          onClick={() => setActiveTab(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
