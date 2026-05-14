import mongoose from "mongoose";

/**
 * Tracks split payment state for a shared cart checkout
 */
const splitEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    amount: { type: Number, required: true },           // Amount this user owes in ₹
    percentage: { type: Number, default: 0 },           // Used in percentage mode
    assignedProductIds: [String],                       // Used in item-based mode
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    paidAt: { type: Date },
    reminderSentAt: { type: Date },
}, { _id: true });

const splitPaymentSchema = new mongoose.Schema({
    sharedCartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SharedCart",
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    totalAmount: { type: Number, required: true },
    splitMode: {
        type: String,
        enum: ["equal", "percentage", "custom", "item-based"],
        default: "equal",
    },
    splits: [splitEntrySchema],
    allPaid: { type: Boolean, default: false },
    completedAt: { type: Date },
}, { timestamps: true });

const SplitPayment = mongoose.model("SplitPayment", splitPaymentSchema);
export default SplitPayment;
