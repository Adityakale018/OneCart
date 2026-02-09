import Order from "../model/oderModel.js";
import User from "../model/UserModel.js";
import razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const currency = "INR";

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const placeOrderRazorpay = async(req, res) => {
    try{
        const {amount,items,address} = req.body;
        const userId = req.userId;
        const orderData = {
            items, 
            amount,
            address,
            userId,
            paymentMethod: "Razorpay",
            paymentStatus: "Pending",
            payment: false,
            date:Date.now()
        }
        const newOrder = new Order(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if(error){
                console.log(error);
                return res.status(500).json({success: false, message: "Razorpay order creation failed" });
            }
            res.status(200).json({success: true, orderId: order.id, amount: order.amount, currency: order.currency});
        });
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success: false, message: error. message });
    }
}

export const verifyRazorpay = async(req, res) => {
    try {
        const userId = req.userId;
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === "paid"){
            await Order.findByIdAndUpdate(orderInfo.receipt, {paymentStatus: "Paid", payment: true});
            await User.findByIdAndUpdate(userId, { cartData:{} });
            return res.status(200).json({success: true, message: "Payment verified and order updated successfully"});
        }else{
            return res.status(400).json({success: false, message: "Payment not successful"});
        }   

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message});
    }
}
export const PlaceOrder = async(req, res) => {
    try {
        // ✅ Extract paymentMethod, paymentStatus, and payment from req.body
        let {items, amount, address, paymentMethod, paymentStatus, payment} = req.body;
        const userId = req.userId;
        
        const orderData = {
            items, 
            amount, 
            userId, 
            address, 
            paymentMethod,   // ← Use the value from frontend
            paymentStatus,   // ← Use the value from frontend
            payment,         // ← Use the value from frontend
            date: new Date()        
        }
        
        const newOrder = new Order(orderData);
        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData:{} });
        
        res.status(200).json({success: true, message:"Order Placed Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error. message });
    }
}

export const userOrders = async(req, res) => {
    try{
        const userId = req.userId;
        const orders = await Order.find({userId});
        return res.status(200).json(orders);
    }catch(error){
        console.log(error)
        return res.status(500).json({message:`userOrders error ${error}`})
    }
}

//admin

export const allOrders = async(req, res) => {
    try{
        const orders = await Order.find({});
        return res.status(200).json(orders);
    }catch(error){
        console.log(error)
        return res.status(500).json({message:`AdminallOrders error ${error}`})
    }       
}

export const updatestatus = async(req, res) => {
    try{
        const {orderId, status} = req.body;
        await Order.findByIdAndUpdate(orderId, {status});
        return res.status(200).json({success:true, message:"Order Status Updated Successfully"});
    }catch(error){
        console.log(error)
        return res.status(500).json({message:`updatestatus error ${error}`})
    }       
}
        