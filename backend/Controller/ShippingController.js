const Shipping = require("../models/ShippingSchema");

const saveShipping = async (req, res) => {
    try {
        const newShipping = new Shipping(req.body);
        await newShipping.save();
        res.status(201).json(newShipping);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getShippingByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const shippingAddresses = await Shipping.find({ userId });

    if (!shippingAddresses || shippingAddresses.length === 0) {
      return res.status(404).json({ message: "No shipping addresses found" });
    }

    res.status(200).json(shippingAddresses);
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateShipping = async (req, res) => {
    try {
        const updated = await Shipping.findOneAndUpdate(
            { userId: req.params.userId },
            req.body,
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    saveShipping,
    getShippingByUser,
    updateShipping,
};

