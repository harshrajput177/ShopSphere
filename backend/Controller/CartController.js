const Cart = require('../models/Cart');
const Product = require('../models/ProductSchema');

// Add to Cart
exports.addToCart = async (req, res) => {
  const { userId, productId, size, color, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId });

    const newItem = {
      productId: product._id,
      title: product.name,
      image: product.image,
      price: product.price,
      size,
      color,
      quantity
    };

    if (!cart) {
      cart = new Cart({ userId, items: [newItem] });
    } else {
      const existingItem = cart.items.find(
        i => i.productId.toString() === productId && i.size === size && i.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push(newItem);
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

 
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save(); // Save updated cart
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};


exports.getCart = async (req, res) => {
    const { userId } = req.params;
     // ✅ check this shows up
  
    try {
      const cart = await Cart.findOne({ userId });
      // console.log("Cart found:", cart); 
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      res.status(200).json({ cartItems: cart.items });
    } catch (err) {
      console.error("Cart fetch error:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  