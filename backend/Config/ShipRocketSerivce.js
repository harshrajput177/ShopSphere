// services/shiprocketService.js
const axios = require('axios');

// Step 1: Token lo
const getShiprocketToken = async () => {
  try {
    const res = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        email:    process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      }
    );
    console.log("✅ Token mila:", res.data.token);
    return res.data.token;
  } catch (err) {
    console.log("❌ Token error:", err.response?.data);  // ye dekho
    throw err;
  }
};

// Step 2: Pincode check karo
const checkPincodeFromShiprocket = async (pincode) => {
  const token = await getShiprocketToken();

  const res = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        pickup_postcode:   "203001",  // tumhara warehouse pincode
        delivery_postcode: pincode,
        cod:               1,
        weight:            0.5
      }
    }
  );

  const data = res.data.data;
  return {
    serviceable:   data.serviceable_couriers?.length > 0,
    cod_available: data.cod === 1,
    delivery_days: data.serviceable_couriers?.[0]?.estimated_delivery_days || 5,
    city:          data.delivery_details?.city || "",
    state:         data.delivery_details?.state || ""
  };
};

module.exports = { checkPincodeFromShiprocket };