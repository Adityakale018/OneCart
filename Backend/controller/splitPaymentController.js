import SplitPayment from "../model/SplitPaymentModel.js";
import SharedCart from "../model/SharedCartModel.js";
import Order from "../model/oderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/splitpayment/create ───────────────────────────────────────────
export const createSplitPayment = async (req, res) => {
    try {
        const { sharedCartId, totalAmount, splitMode, splits, address, items } = req.body;

        const cart = await SharedCart.findById(sharedCartId);
        if (!cart) return res.status(404).json({ message: "Shared cart not found" });
        if (cart.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Only owner can initiate split payment" });
        }

        const splitDoc = await SplitPayment.create({
            sharedCartId,
            totalAmount,
            splitMode,
            splits,
            address,
            items,
        });

        return res.status(201).json({ success: true, splitPayment: splitDoc });
    } catch (error) {
        console.error("createSplitPayment error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/splitpayment/:splitId ──────────────────────────────────────────
export const getSplitPayment = async (req, res) => {
    try {
        const doc = await SplitPayment.findById(req.params.splitId);
        if (!doc) return res.status(404).json({ message: "Split payment not found" });
        return res.status(200).json({ success: true, splitPayment: doc });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET /api/splitpayment/bycart/:cartId ────────────────────────────────────
export const getSplitPaymentByCart = async (req, res) => {
    try {
        const doc = await SplitPayment.findOne({ sharedCartId: req.params.cartId }).sort({ createdAt: -1 });
        if (!doc) return res.status(404).json({ message: "No split payment found for this cart" });
        return res.status(200).json({ success: true, splitPayment: doc });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/splitpayment/:splitId/pay ─────────────────────────────────────
// Creates a Razorpay order for a specific participant
export const initiateParticipantPayment = async (req, res) => {
    try {
        const { splitEntryId } = req.body;
        const doc = await SplitPayment.findById(req.params.splitId);
        if (!doc) return res.status(404).json({ message: "Split payment not found" });

        const entry = doc.splits.id(splitEntryId);
        if (!entry) return res.status(404).json({ message: "Split entry not found" });
        if (entry.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Not your payment entry" });
        }
        if (entry.status === "paid") {
            return res.status(400).json({ message: "Already paid" });
        }

        // Create Razorpay order for this participant's share
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(entry.amount * 100), // paise
            currency: "INR",
            receipt: `sp_${splitEntryId}`,
        });

        entry.razorpayOrderId = razorpayOrder.id;
        await doc.save();

        return res.status(200).json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("initiateParticipantPayment error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/splitpayment/verify ───────────────────────────────────────────
// Verify Razorpay signature and mark participant as paid
export const verifyParticipantPayment = async (req, res) => {
    try {
        const { splitId, splitEntryId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

        // Signature verification
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const doc = await SplitPayment.findById(splitId);
        if (!doc) return res.status(404).json({ message: "Split payment not found" });

        const entry = doc.splits.id(splitEntryId);
        if (!entry) return res.status(404).json({ message: "Split entry not found" });

        entry.status = "paid";
        entry.razorpayPaymentId = razorpayPaymentId;
        entry.paidAt = new Date();

        // Check if all participants paid
        const allPaid = doc.splits.every((s) => s.status === "paid");
        if (allPaid) {
            doc.allPaid = true;
            doc.completedAt = new Date();

            // CREATE THE FINAL ORDER
            const cart = await SharedCart.findById(doc.sharedCartId);
            const participantIds = doc.splits.map(s => s.userId.toString());

            const newOrder = new Order({
                userId: cart.owner,
                participantIds: participantIds,
                items: doc.items,
                amount: doc.totalAmount,
                address: doc.address,
                status: "Order Placed",
                paymentMethod: "Split Payment (Razorpay)",
                paymentStatus: "Paid",
                payment: true,
                date: new Date()
            });

            const savedOrder = await newOrder.save();
            doc.orderId = savedOrder._id;

            // Clear the shared cart items
            cart.items = [];
            cart.isLocked = true; // Keep it locked after order
            await cart.save();
        }

        await doc.save();
        return res.status(200).json({ success: true, allPaid, splitPayment: doc });
    } catch (error) {
        console.error("verifyParticipantPayment error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/splitpayment/:splitId/remind ──────────────────────────────────
export const sendReminder = async (req, res) => {
    try {
        const { splitEntryId } = req.body;
        const doc = await SplitPayment.findById(req.params.splitId);
        if (!doc) return res.status(404).json({ message: "Not found" });

        const entry = doc.splits.id(splitEntryId);
        if (!entry) return res.status(404).json({ message: "Entry not found" });

        entry.reminderSentAt = new Date();
        await doc.save();

        // In production, send email/SMS here
        return res.status(200).json({ success: true, message: "Reminder marked as sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
