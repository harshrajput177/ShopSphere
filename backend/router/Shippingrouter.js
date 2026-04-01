const express = require("express");
const { saveShipping, getShippingByUser, updateShipping } = require("../Controller/ShippingController");

const router = express.Router();

router.post("/", saveShipping);
router.get("/:userId", getShippingByUser);
router.put("/:userId", updateShipping);

module.exports = router;
