import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

/**
 * Custom hook for shared cart real-time collaboration
 * Manages: socket connection, cart state, chat, participant presence
 */
export function useSharedCart(cartId, serverUrl, userData) {
    const socketRef = useRef(null);
    const [cart, setCart] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch initial cart data ───────────────────────────────────────────────
    const fetchCart = useCallback(async () => {
        if (!cartId) return;
        try {
            setLoading(true);
            const res = await axios.get(`${serverUrl}/api/sharedcart/${cartId}`, {
                withCredentials: true,
            });
            setCart(res.data.cart);
            setChatMessages(res.data.cart.chat || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load shared cart");
        } finally {
            setLoading(false);
        }
    }, [cartId, serverUrl]);

    // ── Initialize Socket ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!cartId || !userData) return;

        fetchCart();

        // Connect socket
        socketRef.current = io(serverUrl, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            socket.emit("join-shared-cart", { cartId });
        });

        // Real-time cart updates from other participants
        socket.on("cart-updated", ({ items, action, actorName }) => {
            setCart((prev) => prev ? { ...prev, items } : prev);
        });

        // Online participants
        socket.on("participants-online", ({ onlineUserIds: ids }) => {
            setOnlineUserIds(ids);
        });

        // Chat messages
        socket.on("new-chat-message", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        // Typing indicators
        socket.on("user-typing", ({ name, isTyping, userId }) => {
            setTypingUsers((prev) => {
                if (isTyping) return prev.includes(name) ? prev : [...prev, name];
                return prev.filter((n) => n !== name);
            });
        });

        // Cart locked/unlocked
        socket.on("cart-lock-changed", ({ isLocked }) => {
            setCart((prev) => prev ? { ...prev, isLocked } : prev);
        });

        // Item voted
        socket.on("item-voted", ({ itemId, votes }) => {
            setCart((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((i) =>
                        i._id === itemId ? { ...i, votes } : i
                    ),
                };
            });
        });

        // Participant left / removed
        socket.on("participant-left", ({ removedUserId }) => {
            setCart((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    participants: prev.participants.filter(
                        (p) => p.userId?.toString() !== removedUserId
                    ),
                };
            });
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [cartId, serverUrl, userData]);

    // ── Actions ───────────────────────────────────────────────────────────────

    const emitCartUpdate = useCallback((items, action) => {
        socketRef.current?.emit("cart-update", {
            cartId,
            items,
            action,
            actorName: userData?.name,
        });
    }, [cartId, userData]);

    const addItem = useCallback(async (productId, size, quantity = 1) => {
        try {
            await axios.post(
                `${serverUrl}/api/sharedcart/${cartId}/item`,
                { productId, size, quantity },
                { withCredentials: true }
            );
            // Backend broadcasts cart-updated via socket to all room members (incl. sender)
        } catch (err) {
            console.error("addItem error:", err);
        }
    }, [cartId, serverUrl]);

    const removeItem = useCallback(async (itemId) => {
        try {
            await axios.delete(
                `${serverUrl}/api/sharedcart/${cartId}/item/${itemId}`,
                { withCredentials: true }
            );
            // Backend broadcasts cart-updated via socket to all room members (incl. sender)
        } catch (err) {
            console.error("removeItem error:", err);
        }
    }, [cartId, serverUrl]);

    const updateQuantity = useCallback(async (itemId, quantity) => {
        try {
            await axios.put(
                `${serverUrl}/api/sharedcart/${cartId}/item`,
                { itemId, quantity },
                { withCredentials: true }
            );
            // Backend broadcasts cart-updated via socket to all room members (incl. sender)
        } catch (err) {
            console.error("updateQuantity error:", err);
        }
    }, [cartId, serverUrl]);

    const voteItem = useCallback(async (itemId, vote) => {
        try {
            const res = await axios.post(
                `${serverUrl}/api/sharedcart/${cartId}/vote`,
                { itemId, vote },
                { withCredentials: true }
            );
            setCart((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((i) =>
                        i._id === itemId ? { ...i, votes: res.data.item.votes } : i
                    ),
                };
            });
            socketRef.current?.emit("vote-update", {
                cartId,
                itemId,
                votes: res.data.item.votes,
            });
        } catch (err) {
            console.error("voteItem error:", err);
        }
    }, [cartId, serverUrl]);

    const sendMessage = useCallback((message) => {
        const msg = { message, name: userData?.name, userId: userData?._id, timestamp: new Date() };
        setChatMessages((prev) => [...prev, msg]);
        socketRef.current?.emit("chat-message", { cartId, ...msg });
        // Persist to DB
        axios.post(
            `${serverUrl}/api/sharedcart/${cartId}/chat`,
            { message },
            { withCredentials: true }
        ).catch(console.error);
    }, [cartId, serverUrl, userData]);

    const sendTyping = useCallback((isTyping) => {
        socketRef.current?.emit("typing", { cartId, name: userData?.name, isTyping });
    }, [cartId, userData]);

    const toggleLock = useCallback(async () => {
        try {
            const res = await axios.post(
                `${serverUrl}/api/sharedcart/${cartId}/lock`,
                {},
                { withCredentials: true }
            );
            setCart((prev) => prev ? { ...prev, isLocked: res.data.isLocked } : prev);
            socketRef.current?.emit("cart-lock-toggle", { cartId, isLocked: res.data.isLocked });
        } catch (err) {
            console.error("toggleLock error:", err);
        }
    }, [cartId, serverUrl]);

    const removeParticipant = useCallback(async (uid) => {
        try {
            const res = await axios.delete(
                `${serverUrl}/api/sharedcart/${cartId}/participant/${uid}`,
                { withCredentials: true }
            );
            setCart((prev) => prev ? { ...prev, participants: res.data.participants } : prev);
            socketRef.current?.emit("participant-removed", { cartId, removedUserId: uid });
        } catch (err) {
            console.error("removeParticipant error:", err);
        }
    }, [cartId, serverUrl]);

    return {
        cart, setCart,
        onlineUserIds,
        chatMessages,
        typingUsers,
        loading, error,
        addItem, removeItem, updateQuantity,
        voteItem, sendMessage, sendTyping,
        toggleLock, removeParticipant,
        fetchCart,
    };
}
