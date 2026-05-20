import SharedCart from "../model/SharedCartModel.js";
import User from "../model/UserModel.js";
import { nanoid } from "nanoid";

// ─── Helper: find shared cart & verify participant ───────────────────────────
const getCartAndVerify = async (cartId, userId, requireOwner = false) => {
    // Support both MongoDB ObjectId AND short cartCode from invite links
    const query = cartId.match(/^[0-9a-fA-F]{24}$/)
        ? { $or: [{ _id: cartId }, { cartCode: cartId }] }
        : { cartCode: cartId };
    const cart = await SharedCart.findOne(query);
    if (!cart) throw { status: 404, message: "Shared cart not found" };
    const isParticipant = cart.participants.some(
        (p) => p.userId.toString() === userId.toString()
    );
    if (!isParticipant) throw { status: 403, message: "Not a participant" };
    if (requireOwner && cart.owner.toString() !== userId.toString()) {
        throw { status: 403, message: "Only the cart owner can do this" };
    }
    return cart;
};

// ─── POST /api/sharedcart/create ─────────────────────────────────────────────
export const createSharedCart = async (req, res) => {
    try {
        const { name } = req.body;
        const cartCode = nanoid(10); // short unique code e.g. "Xy2kQ9mPaR"

        const user = await User.findById(req.userId).select("name email");
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await SharedCart.create({
            cartCode,
            owner: req.userId,
            participants: [{
                userId: req.userId,
                name: user.name,
                role: "owner",
                isOnline: true,
            }],
            items: [],
            chat: [],
        });

        return res.status(201).json({ success: true, cart, cartCode });
    } catch (error) {
        console.error("createSharedCart error:", error);
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── GET /api/sharedcart/:cartId ─────────────────────────────────────────────
export const getSharedCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        // Allow lookup by MongoDB ID or by cartCode
        const cart = await SharedCart.findOne({
            $or: [
                { _id: cartId.match(/^[0-9a-fA-F]{24}$/) ? cartId : null },
                { cartCode: cartId },
            ],
        });
        if (!cart) return res.status(404).json({ message: "Shared cart not found" });

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("getSharedCart error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/join ───────────────────────────────────────────────
export const joinSharedCart = async (req, res) => {
    try {
        const { cartCode } = req.body;
        const user = await User.findById(req.userId).select("name email");
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await SharedCart.findOne({
            $or: [
                { cartCode },
                ...(cartCode?.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cartCode }] : []),
            ],
        });
        if (!cart) return res.status(404).json({ message: "Invalid invite code" });

        // Already a participant?
        const already = cart.participants.find(
            (p) => p.userId.toString() === req.userId.toString()
        );
        if (already) return res.status(200).json({ success: true, cart });

        cart.participants.push({
            userId: req.userId,
            name: user.name,
            role: "member",
            isOnline: true,
        });
        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("joinSharedCart error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/:cartId/item ───────────────────────────────────────
export const addItem = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const cart = await getCartAndVerify(req.params.cartId, req.userId);
        if (cart.isLocked) return res.status(403).json({ message: "Cart is locked by owner" });

        const user = await User.findById(req.userId).select("name");
        // Check if same product+size already exists
        const existing = cart.items.find(
            (i) => i.productId === productId && i.size === size
        );
        if (existing) {
            existing.quantity += quantity || 1;
        } else {
            cart.items.push({
                productId,
                size,
                quantity: quantity || 1,
                addedBy: { userId: req.userId, name: user.name },
            });
        }
        await cart.save();

        const io = req.app.get("io");
        if (io) {
            io.to(req.params.cartId).emit("cart-updated", { items: cart.items, action: "add", actorName: user.name });
        }

        return res.status(200).json({ success: true, items: cart.items });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── PUT /api/sharedcart/:cartId/item ─────────────────────────────────────────
export const updateItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const cart = await getCartAndVerify(req.params.cartId, req.userId);
        if (cart.isLocked) return res.status(403).json({ message: "Cart is locked" });

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (quantity <= 0) {
            item.deleteOne();
        } else {
            item.quantity = quantity;
        }
        await cart.save();

        const user = await User.findById(req.userId).select("name");
        const io = req.app.get("io");
        if (io) {
            io.to(req.params.cartId).emit("cart-updated", { items: cart.items, action: "update", actorName: user.name });
        }

        return res.status(200).json({ success: true, items: cart.items });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── DELETE /api/sharedcart/:cartId/item/:itemId ─────────────────────────────
export const removeItem = async (req, res) => {
    try {
        const cart = await getCartAndVerify(req.params.cartId, req.userId);
        if (cart.isLocked) return res.status(403).json({ message: "Cart is locked" });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.deleteOne();
        await cart.save();

        const user = await User.findById(req.userId).select("name");
        const io = req.app.get("io");
        if (io) {
            io.to(req.params.cartId).emit("cart-updated", { items: cart.items, action: "remove", actorName: user.name });
        }

        return res.status(200).json({ success: true, items: cart.items });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/:cartId/vote ───────────────────────────────────────
export const voteItem = async (req, res) => {
    try {
        const { itemId, vote } = req.body; // vote: "up" | "down"
        const cart = await getCartAndVerify(req.params.cartId, req.userId);

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        const uid = req.userId.toString();
        // Toggle: remove from opposite, add to chosen
        item.votes.up = item.votes.up.filter((id) => id.toString() !== uid);
        item.votes.down = item.votes.down.filter((id) => id.toString() !== uid);
        if (vote === "up") item.votes.up.push(req.userId);
        else if (vote === "down") item.votes.down.push(req.userId);

        await cart.save();
        return res.status(200).json({ success: true, item });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/:cartId/lock ───────────────────────────────────────
export const toggleLock = async (req, res) => {
    try {
        const cart = await getCartAndVerify(req.params.cartId, req.userId, true);
        cart.isLocked = !cart.isLocked;
        await cart.save();
        return res.status(200).json({ success: true, isLocked: cart.isLocked });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── DELETE /api/sharedcart/:cartId/participant/:uid ─────────────────────────
export const removeParticipant = async (req, res) => {
    try {
        const cart = await getCartAndVerify(req.params.cartId, req.userId, true);
        const uid = req.params.uid;

        if (uid === req.userId.toString()) {
            return res.status(400).json({ message: "Owner cannot remove themselves" });
        }

        cart.participants = cart.participants.filter(
            (p) => p.userId.toString() !== uid
        );
        await cart.save();
        return res.status(200).json({ success: true, participants: cart.participants });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/:cartId/splits ─────────────────────────────────────
export const assignSplits = async (req, res) => {
    try {
        const { splitMode, splits } = req.body;
        const cart = await getCartAndVerify(req.params.cartId, req.userId, true);
        cart.splitMode = splitMode;
        cart.paymentSplits = splits;
        await cart.save();
        return res.status(200).json({ success: true, paymentSplits: cart.paymentSplits });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// ─── POST /api/sharedcart/:cartId/chat ───────────────────────────────────────
export const sendChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const user = await User.findById(req.userId).select("name");
        const cart = await getCartAndVerify(req.params.cartId, req.userId);

        const chatMsg = {
            userId: req.userId,
            name: user.name,
            message,
            timestamp: new Date(),
        };
        cart.chat.push(chatMsg);
        // Keep last 100 messages
        if (cart.chat.length > 100) cart.chat = cart.chat.slice(-100);
        await cart.save();

        return res.status(200).json({ success: true, chatMsg });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
