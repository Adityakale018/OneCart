import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    participantIds: { type: Array, default: [] }, // For shared cart participants
    items : { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String,required: true , default: "pending" },
    paymentMethod: { type: String, required:  true }, 
    paymentStatus: { type: String, required: true },
    payment : { type: Boolean, required: true,default: false },
    date : { type: Date, required: true }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

export default Order;