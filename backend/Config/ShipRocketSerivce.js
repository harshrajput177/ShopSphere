const axios = require('axios');

const checkPincodeFromShiprocket = async (pincode) => {
  const res = await axios.get(
    `https://api.postalpincode.in/pincode/${pincode}`
  );

  const result = res.data[0];

  // Pincode valid nahi
  if (result.Status !== "Success" || !result.PostOffice?.length) {
    return {
      serviceable:   false,
      cod_available: false,
      delivery_days: 0,
      city:          "",
      state:         ""
    };
  }

  // Delivery wala post office dhundo
  const deliveryOffice = result.PostOffice.find(
    (po) => po.DeliveryStatus === "Delivery"
  ) || result.PostOffice[0];

  return {
    serviceable:   true,           // pincode valid hai = serviceable
    cod_available: true,           // default true
    delivery_days: 5,              // fixed 5 days (Shiprocket nahi hai to estimate)
    city:          deliveryOffice.District || deliveryOffice.Division || "",
    state:         deliveryOffice.State || ""
  };
};

module.exports = { checkPincodeFromShiprocket };