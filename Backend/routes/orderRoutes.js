import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { allOrders, PlaceOrder, placeOrderRazorpay, updatestatus, userOrders, verifyRazorpay } from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRoutes = express.Router();

orderRoutes.post("/placeorder",isAuth,PlaceOrder)
orderRoutes.post("/razorpay",isAuth,placeOrderRazorpay)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.post("/verifyrazorpay",isAuth,verifyRazorpay)

//admin
orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.post("/status",adminAuth,updatestatus)
export default orderRoutes;