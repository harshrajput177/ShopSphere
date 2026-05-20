const express = require("express");
const { getAddresses, addAddress, updateAddress, deleteAddress } = require("../controllers/AddressController");
const { protect } = require("../MiddleWare/authmiddleware");

const router = express.Router();
router.get   ("/",    protect, getAddresses);
router.post  ("/",    protect, addAddress);
router.put   ("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;