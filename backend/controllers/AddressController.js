const Address = require("../models/AddressModel");

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })  
      .sort({ isDefault: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { name, phone, pincode, locality, address, city, state, landmark, addressType, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user.id,  
      name, phone, pincode, locality, address, city, state, landmark, addressType,
      isDefault: isDefault || false,
    });

    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false }); 
    }
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },  
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };