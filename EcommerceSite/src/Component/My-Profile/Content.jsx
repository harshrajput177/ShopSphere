import React from 'react';
import '../../Style-CSS/MyProfile-css/Content.css'
import Address from './Address';
import Voucher from './Voucher';
import Wishlist from './Whislist';
import RateUs from './RateUs';

function Content({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'Address':
        return <Address />;
      case 'Voucher':
        return <Voucher />;
      case 'My Wishlist':
        return <Wishlist />;
      case 'Rate Us':
        return <RateUs />;
      default:
        return <Address />;
    }
  };

  return <div className="User-Profile-content">{renderContent()}</div>;
}

export default Content;
