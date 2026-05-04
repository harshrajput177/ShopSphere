const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies.guestId;


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
    price: finalPrice,           // ✅ 1150 - 400 = 750
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
    res.json(cart);
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;

  // ✅ Ye logs lagao
  console.log("GET CART - userId:", userId);
  console.log("GET CART - guestId:", guestId);
  console.log("GET CART - cookies:", req.cookies);

  let cart;

  if (userId) {
    cart = await Cart.findOne({ userId });
  } else {
    cart = await Cart.findOne({ guestId });
  }

  console.log("GET CART - found cart:", cart); // ✅ ye bhi

  res.json(cart || { items: [] });
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies.guestId;

    let cart = userId 
      ? await Cart.findOne({ userId }) 
      : await Cart.findOne({ guestId });

    if (!cart) return res.json({ items: [] });

    const { productId, size } = req.body;

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].qty > 1) {
        // ✅ Qty kam karo, delete mat karo
        cart.items[itemIndex].qty -= 1;
      } else {
        // ✅ Qty 1 hai toh remove karo
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log("REMOVE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.mergeCart = async (req, res) => {
  const userId = req.user.id;
  const guestId = req.cookies.guestId;

  const guestCart = await Cart.findOne({ guestId });
  let userCart = await Cart.findOne({ userId });


  if (!guestCart || guestCart.items.length === 0) {
    return res.json(userCart || { items: [] });
  }

  if (!userCart) {
    guestCart.userId = userId;
    guestCart.guestId = null;
    await guestCart.save();
    return res.json(guestCart);
  }

  // ✅ User cart ko guest cart se replace karo
  userCart.items = guestCart.items;
  await userCart.save();

  // ✅ Guest cart delete karo
  await Cart.deleteOne({ guestId });

  res.json(userCart);
};