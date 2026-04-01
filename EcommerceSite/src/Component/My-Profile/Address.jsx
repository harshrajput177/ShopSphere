import React from 'react';
import '../../Style-CSS/MyProfile-css/Address.css';
import HomeIcon from '@mui/icons-material/Home';

function Address() {
  return (
    <div className="address-page">
      <h2>Delivery address</h2>
      <section  className='user-profile-two-card'>
   
        <div className='Home-card'>
        <input type="radio" />
          <div className='Home-content'>
          <div  className='Home-icons-text'> 
          <HomeIcon />
          <h2>SEND TO <br /><span>My Office</span></h2>
          </div>
          <p>SBI Building, street 3, Software Park</p>
          </div>

          <h3  className='profile-Edit'>Edit</h3>
        </div>


        <div  className='Office-card'>
        <div className='Home-card'>
        <input type="radio" />
          <div className='Home-content'>
          <div  className='Home-icons-text'> 
          <HomeIcon className='HomeIcon'/>
          <h2>SEND TO <br /><span>My Office</span></h2>
          </div>
          <p>SBI Building, street 3, Software Park</p>
          </div>

          <h3  className='profile-Edit'>Edit</h3>
        </div>
        </div>
      </section>
    </div>
  );
}

export default Address;
