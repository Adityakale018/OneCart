import Order from "../model/oderModel.js";
import User from "../model/UserModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const currency = "INR";

// ── Razorpay instance ─────────────────────────────────────────────────────────
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Create Razorpay order ─────────────────────────────────────────────────────
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { amount, items, address } = req.body;
        const userId = req.userId;

        // 1. Save order to DB first (status: pending)
        const orderData = {
            items,
            amount,
            address,
            userId,
            paymentMethod: "Razorpay",
            paymentStatus: "Pending",
            payment: false,
            date: Date.now(),
        };
        const newOrder = new Order(orderData);
        await newOrder.save();

        // 2. Create Razorpay order (promise-based)
        const options = {
            amount: Math.round(amount * 100), // paise
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay create order error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ── Verify Razorpay payment signature ─────────────────────────────────────────
export const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;

        // Validate signature using HMAC SHA256
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment signature verification failed" });
        }

        // Fetch order to find our DB receipt
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Update order as paid
        await Order.findByIdAndUpdate(orderInfo.receipt, {
            paymentStatus: "Paid",
            payment: true,
        });

        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Razorpay verify error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ── COD Order ─────────────────────────────────────────────────────────────────
export const PlaceOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod, paymentStatus, payment } = req.body;
        const userId = req.userId;

        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod,
            paymentStatus,
            payment,
            date: new Date(),
        };

        const newOrder = new Order(orderData);
        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(200).json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error("PlaceOrder error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ── User Orders ───────────────────────────────────────────────────────────────
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId });
        return res.status(200).json(orders);
    } catch (error) {
        console.error("userOrders error:", error);
        return res.status(500).json({ message: `userOrders error ${error}` });
    }
};

// ── Admin: All Orders ─────────────────────────────────────────────────────────
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json(orders);
    } catch (error) {
        console.error("allOrders error:", error);
        return res.status(500).json({ message: `allOrders error ${error}` });
    }
};

// ── Admin: Update Status ──────────────────────────────────────────────────────
export const updatestatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        return res.status(200).json({ success: true, message: "Order Status Updated Successfully" });
    } catch (error) {
        console.error("updatestatus error:", error);
        return res.status(500).json({ message: `updatestatus error ${error}` });
    }
};