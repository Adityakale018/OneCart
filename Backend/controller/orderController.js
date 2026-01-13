import Order from "../model/oderModel.js";
import User from "../model/UserModel.js";




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
        