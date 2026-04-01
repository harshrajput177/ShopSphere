const Order = require('../models/Ordermodel');
const sendEventToMeta = require('../Config/ConversionApi');  
const { hashData } = require('../Config/hashdata');

exports.createOrder = async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, paymentInfo, userEmail, userPhone } = req.body;

    const newOrder = new Order({
      userId,
      items: cartItems,
      amount: totalAmount,
      paymentId: paymentInfo.paymentId,
    });

    // 2️⃣ Save to DB
    await newOrder.save();

    // 3️⃣ Send event to Meta Pixel
    try {
      await sendEventToMeta({
        pixelId: process.env.META_PIXEL_ID,
        accessToken: process.env.META_ACCESS_TOKEN,
        eventName: 'Purchase',
        eventSourceUrl: 'https://ishum.in',  // ✅ Replace with your actual thank you page URL
        userAgent: req.headers['user-agent'],
        customData: {
          value: totalAmount,
          currency: 'INR'
        },
        userData: {
          em: hashData(userEmail),  // ✅ Make sure email is passed from frontend
          ph: hashData(userPhone)   // ✅ Make sure phone is passed from frontend
        }
      });

      console.log('✅ Meta Pixel Purchase event sent successfully.');
    } catch (pixelError) {
      console.error('❌ Failed to send event to Meta:', pixelError.message);
      // Optional: continue without failing the order creation
    }

    res.status(201).json({ success: true, message: 'Order saved successfully' });

  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ success: false, message: 'Failed to save order', error: err.message });
  }
};


// Controller/OrderController.js

exports.getUserLatestOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const latestOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 }); // Get latest one

    if (!latestOrder) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(latestOrder);
  } catch (err) {
    console.error("Error fetching latest user order:", err);
    res.status(500).json({ message: 'Failed to fetch latest user order' });
  }
};


exports.getDeliveredOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: 'delivered' });
    res.json({ deliveredOrders: count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to count delivered orders' });
  }
};

// Optional: Get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email phone');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Something went wrong while fetching orders" });
  }
};



// Cancel Order (just update status)
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, message: "Order cancelled", order: updatedOrder });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};

