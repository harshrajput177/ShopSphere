const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// helper
const getUserId = (req) => {
  if (!req.user?.id) return null;
  try {
    return new mongoose.Types.ObjectId(req.user.id);
  } catch {
    return null;
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const guestId = req.guestId || req.cookies?.guestId; 


    const { productId, size } = req.body;

    let cart;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    const product = await Product.findById(productId);
    const variant = product.variants[0];

    let sizeObj = variant.sizes.find(
      (s) => String(s.size) === String(size)
    );

    if (!sizeObj) sizeObj = variant.sizes[0];

    const discount = product.discount || 0;
    const finalPrice = Math.max(0, sizeObj.price - discount);

    const item = {
      productId,
      size: sizeObj.size,
      price: finalPrice,
      originalPrice: sizeObj.price,
      image: variant.mainImage,
      title: product.title,
      qty: 1,
    };

    if (!cart) {
      cart = new Cart({
        userId: userId || null,
        guestId: guestId || null,
        items: [item],
      });
    } else {
      const exist = cart.items.find(
        (i) =>
          i.productId.toString() === productId &&
          i.size === sizeObj.size
      );

      if (exist) exist.qty += 1;
      else cart.items.push(item);
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
      console.log("ADD TO CART ERROR:", err);
    console.log(err);
  }
};


exports.getCart = async (req, res) => {
  const userId = getUserId(req);
  const guestId = req.guestId || req.cookies?.guestId; 


  let cart;

  if (userId) {
    cart = await Cart.findOne({ userId });
  }

  if (!cart && guestId) {
    cart = await Cart.findOne({ guestId });
  }


  res.json({ items: cart?.items || [] });
};

exports.removeItem = async (req, res) => {
  try {
    const userId = getUserId(req);
   const guestId = req.guestId || req.cookies?.guestId;  

    let cart = userId
      ? await Cart.findOne({ userId })
      : await Cart.findOne({ guestId });

    if (!cart) return res.json({ items: [] });

    const { productId, size } = req.body;

    const itemIndex = cart.items.findIndex(
      (i) =>
        i.productId.toString() === productId &&
        i.size === size
    );

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].qty > 1) {
        cart.items[itemIndex].qty -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (error) {
    console.log("REMOVE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.mergeCart = async (req, res) => {
  const userId = getUserId(req);
  const guestId = req.guestId || req.cookies?.guestId;

  const guestCart = await Cart.findOne({ guestId });
  let userCart = await Cart.findOne({ userId });

  if (!guestCart || guestCart.items.length === 0) {
    return res.json({ items: userCart?.items || [] });
  }

  
  if (userCart && userCart._id.toString() === guestCart._id.toString()) {
    return res.json({ items: userCart.items });
  }

 
  if (!userCart) {
    guestCart.userId = userId;
    guestCart.guestId = null;
    await guestCart.save();
    return res.json({ items: guestCart.items });
  }

  // Dono alag hain — merge karo aur guest wala delete karo
  userCart.items = guestCart.items;
  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });  

  res.json({ items: userCart.items });
};