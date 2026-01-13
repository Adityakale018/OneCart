import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { allOrders, PlaceOrder, updatestatus, userOrders } from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRoutes = express.Router();

orderRoutes.post("/placeorder",isAuth,PlaceOrder)
orderRoutes.post("/userorder",isAuth,userOrders)

//admin
orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.post("/status",adminAuth,updatestatus)
export default orderRoutes;