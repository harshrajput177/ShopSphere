const express = require("express");
const router = express.Router();
const Attribute = require("../models/AttributeModel");

// ✅ CREATE
router.post("/create", async (req, res) => {
  try {
    const attr = new Attribute(req.body);
    await attr.save();
    res.json(attr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET BY PRODUCT TYPE
router.get("/product/:productTypeId", async (req, res) => {
  try {
    const attrs = await Attribute.find({
      productTypes: req.params.productTypeId
    });

    res.json(attrs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE ATTRIBUTE
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Attribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // updated data return karega
    );

    if (!updated) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE ATTRIBUTE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Attribute.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    res.json({ message: "Attribute deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;