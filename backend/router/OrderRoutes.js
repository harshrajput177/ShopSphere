const express = require('express');
const router = express.Router();
const { protect } = require("../MiddleWare/authmiddleware");

const OrderController = require('../controllers/OrderController');

router.get('/user/:userId/latest', OrderController.getUserLatestOrder);  
router.post('/',  protect, OrderController.createOrder);
router.get("/my-orders", protect, OrderController.getMyOrders);
router.get('/delivered-count', OrderController.getDeliveredOrdersCount);
router.get("/:id", protect, OrderController.getOrderById);
router.get('/all', OrderController.getAllOrders);
router.put('/update-status/:orderId', OrderController.updateOrderStatus);
router.put("/:id/cancel", protect, OrderController.cancelOrder);

module.exports = router;