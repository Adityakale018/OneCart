import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import sharedCartRoutes from "./routes/sharedCartRoutes.js";
import splitPaymentRoutes from "./routes/splitPaymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Model for real-time persistence
import SharedCart from "./model/SharedCartModel.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app); // wrap express in http server for Socket.IO

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    "https://onecart-admin-zjpy.onrender.com",
    "https://onecart-frontend-ragv.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── REST Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/sharedcart", sharedCartRoutes);
app.use("/api/splitpayment", splitPaymentRoutes);
app.use("/api/ai", aiRoutes);

// ─── Socket.IO Setup ──────────────────────────────────────────────────────────
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Authenticate socket connections via JWT cookie
io.use((socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie || "";
        const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
        if (!tokenMatch) return next(new Error("Authentication required"));
        const decoded = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

// Track online users per cart room: { cartId: Set<userId> }
const cartRooms = {};

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    // ── Join a shared cart room ───────────────────────────────────────────────
    socket.on("join-shared-cart", async ({ cartId }) => {
        socket.join(cartId);
        cartRooms[cartId] = cartRooms[cartId] || new Set();
        cartRooms[cartId].add(socket.userId);

        // Mark participant as online in DB
        await SharedCart.findByIdAndUpdate(
            cartId,
            { $set: { "participants.$[p].isOnline": true } },
            { arrayFilters: [{ "p.userId": socket.userId }] }
        ).catch(() => {});

        // Broadcast updated online list to everyone in the room
        io.to(cartId).emit("participants-online", {
            onlineUserIds: [...cartRooms[cartId]],
        });
        console.log(`User ${socket.userId} joined room: ${cartId}`);
    });

    // ── Real-time cart update (add/remove/quantity change) ────────────────────
    socket.on("cart-update", ({ cartId, items, action, actorName }) => {
        // Broadcast to everyone ELSE in the room
        socket.to(cartId).emit("cart-updated", { items, action, actorName });
    });

    // ── Chat message ──────────────────────────────────────────────────────────
    socket.on("chat-message", ({ cartId, message, name, timestamp }) => {
        io.to(cartId).emit("new-chat-message", { message, name, timestamp, userId: socket.userId });
    });

    // ── Typing / activity indicator ───────────────────────────────────────────
    socket.on("typing", ({ cartId, name, isTyping }) => {
        socket.to(cartId).emit("user-typing", { name, isTyping, userId: socket.userId });
    });

    // ── Vote update ───────────────────────────────────────────────────────────
    socket.on("vote-update", ({ cartId, itemId, votes }) => {
        socket.to(cartId).emit("item-voted", { itemId, votes });
    });

    // ── Cart locked/unlocked by owner ─────────────────────────────────────────
    socket.on("cart-lock-toggle", ({ cartId, isLocked }) => {
        socket.to(cartId).emit("cart-lock-changed", { isLocked });
    });

    // ── Participant removed ───────────────────────────────────────────────────
    socket.on("participant-removed", ({ cartId, removedUserId }) => {
        io.to(cartId).emit("participant-left", { removedUserId });
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
        for (const cartId of socket.rooms) {
            if (cartRooms[cartId]) {
                cartRooms[cartId].delete(socket.userId);
                io.to(cartId).emit("participants-online", {
                    onlineUserIds: [...cartRooms[cartId]],
                });
            }
        }
        // Mark offline in DB
        await SharedCart.updateMany(
            { "participants.userId": socket.userId },
            { $set: { "participants.$[p].isOnline": false } },
            { arrayFilters: [{ "p.userId": socket.userId }] }
        ).catch(() => {});

        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
httpServer.listen(port, () => {
    console.log(`Hello Server running on ${port}`);
    connectDb();
});
