const Pincode = require("../models/PinCodeModel");
const {
  checkPincodeFromShiprocket,
} = require("../Config/ShipRocketSerivce");

// ── Helper: Delivery date calculate karo ──────────────────
const getDeliveryDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  // Returns: "Tue, 27 May"
};

// ── Main Controller ────────────────────────────────────────
const checkPincodeController = async (req, res) => {
  const { pincode } = req.params;

  // Step 1: Validate
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: "Valid 6-digit pincode daalo",
    });
  }

  try {
    // Step 2: DB mein cached data dekho
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cached = await Pincode.findOne({ pincode });

    if (cached && cached.last_checked > oneDayAgo) {
      // Cache hit — seedha return karo
      return res.status(200).json({
        success: true,
        source: "cache",                        // debug ke liye
        serviceable: cached.is_serviceable,
        cod_available: cached.cod_available,
        city: cached.city,
        state: cached.state,
        estimated_delivery: getDeliveryDate(cached.delivery_days),
      });
    }

    // Step 3: Cache miss — Shiprocket se lo
    const freshData = await checkPincodeFromShiprocket(pincode);

    // Step 4: DB mein save/update karo (upsert)
    await Pincode.findOneAndUpdate(
      { pincode },                              // find condition
      {
        pincode,
        city: freshData.city,
        state: freshData.state,
        is_serviceable: freshData.serviceable,
        cod_available: freshData.cod_available,
        delivery_days: freshData.delivery_days,
        last_checked: new Date(),
      },
      { upsert: true, new: true }               // create if not exists
    );

    // Step 5: Response bhejo
    return res.status(200).json({
      success: true,
      source: "shiprocket",
      serviceable: freshData.serviceable,
      cod_available: freshData.cod_available,
      city: freshData.city,
      state: freshData.state,
      estimated_delivery: getDeliveryDate(freshData.delivery_days),
    });

} catch (err) {
  console.error("Pincode Controller Error:", err.message);
  console.error("Full error:", err.response?.data); // ← ye add karo
  return res.status(500).json({
    success: false,
    message: err.response?.data?.message || "Server error",
  });
}
};

module.exports = { checkPincodeController };