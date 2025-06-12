import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  checkout,                // updated here
  getSingleOrderController,
  updateDeliveryStatusController,
  verifyEsewaController,  // Uncomment once implemented
} from '../controllers/order.controller.js';



const orderRouter = Router();

// Cash on Delivery order
orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController);

// Checkout - generate eSewa payment payload
orderRouter.post('/checkout', auth, checkout);

// Order Tracking for user
orderRouter.get('/user', auth, getOrderDetailsController);

// TODO: Implement verify eSewa controller to handle payment verification callback
orderRouter.post('/verify-esewa',auth, verifyEsewaController);

// Get user's order list
orderRouter.get('/order-list', auth, getOrderDetailsController);

// Get single order by id
orderRouter.get('/:id', auth, getSingleOrderController);

// Add delivery status update route
orderRouter.put('/update-status', auth, updateDeliveryStatusController);

export default orderRouter;
