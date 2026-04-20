const express = require("express");
const router = express.Router();

router.post("/create", async (req, res) => {
  const attr = new Attribute(req.body);
  await attr.save();
  res.json(attr);
});

router.get("/product/:id", async (req, res) => {
  const attrs = await Attribute.find({
    productTypes: req.params.id
  });
  res.json(attrs);
});

module.exports = router;