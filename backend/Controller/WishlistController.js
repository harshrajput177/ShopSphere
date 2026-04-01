const Wishlist = require('../models/Wishlist');
const Product = require('../models/ProductSchema');

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const exists = wishlist.items.some(
        item => item.productId.toString() === productId
      );
      if (exists) {
        return res.status(200).json({ message: 'Already in wishlist' });
      }
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing userId or productId" });
  }

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json({ message: "Item removed from wishlist", wishlist: updatedWishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getWishlistByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({ wishlist: wishlist.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { addToWishlist, removeFromWishlist, getWishlistByUserId };


