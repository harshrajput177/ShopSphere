// controllers/wishlistController.js
const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const item = req.body;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [item] });
  } else {
    const exist = wishlist.items.find(
      (i) => i.productId.toString() === item.productId
    );

    if (!exist) {
      wishlist.items.push(item);
    }
  }

  await wishlist.save();
  res.json(wishlist);
};


exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id })
    .populate("items.productId");

  res.json(wishlist || { items: [] });
};

exports.removeWishlistItem = async (req, res) => {
  const { productId } = req.body;

  const wishlist = await Wishlist.findOne({ userId: req.user.id });

  wishlist.items = wishlist.items.filter(
    (i) => i.productId.toString() !== productId
  );

  await wishlist.save();
  res.json(wishlist);
};