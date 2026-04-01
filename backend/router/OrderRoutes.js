const express = require('express');
const router = express.Router();
const verifyToken = require("../MiddleWare/MiddleWare");
const {
  createOrder,
  getUserLatestOrder,
  getDeliveredOrdersCount,
  getAllOrders,
  updateOrderStatus,
   getMyOrders,
  cancelOrder 
} = require('../Controller/OrderController');
router.get('/user/:userId/latest', getUserLatestOrder);  
router.post('/', createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get('/delivered-count', getDeliveredOrdersCount);
router.get('/all', getAllOrders);
router.put('/update-status/:orderId', updateOrderStatus);
router.put('/cancel/:orderId', cancelOrder);


module.exports = router;

