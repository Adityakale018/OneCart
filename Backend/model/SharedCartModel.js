import mongoose from "mongoose";

/**
 * Sub-schema for a product vote
 */
const voteSchema = new mongoose.Schema({
    up: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    down: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { _id: false });

/**
 * Sub-schema for each item in the shared cart
 */
const sharedItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
    },
    votes: { type: voteSchema, default: () => ({ up: [], down: [] }) },
});

/**
 * Sub-schema for each chat message
 */
const chatMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

/**
 * Sub-schema for participant
 */
const participantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["owner", "member"], default: "member" },
    isOnline: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
});

/**
 * Sub-schema for payment split assignment per participant
 */
const paymentSplitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    amount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    assignedItems: [String], // productIds
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
}, { _id: false });

/**
 * Main shared cart schema
 */
const sharedCartSchema = new mongoose.Schema({
    // Unique short code used in invite links
    cartCode: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [participantSchema],
    items: [sharedItemSchema],
    chat: [chatMessageSchema],
    isLocked: { type: Boolean, default: false },
    splitMode: {
        type: String,
        enum: ["equal", "percentage", "custom", "item-based"],
        default: "equal",
    },
    paymentSplits: [paymentSplitSchema],
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
}, { timestamps: true });

const SharedCart = mongoose.model("SharedCart", sharedCartSchema);
export default SharedCart;
