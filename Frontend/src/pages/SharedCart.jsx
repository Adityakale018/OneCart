import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { userDatacontext } from "../context/UserContext";
import { useSharedCart } from "../hooks/useSharedCart";
import {
    FiUsers, FiLock, FiUnlock, FiSend, FiTrash2, FiPlus, FiMinus,
    FiCopy, FiCheckCircle, FiXCircle, FiShoppingBag,
} from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown, FaCrown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

/* ─── Avatar helper ───────────────────────────────────────────────── */
const Avatar = ({ name = "?", size = "md", online = false }) => {
    const colors = [
        "bg-rose-500", "bg-violet-500", "bg-blue-500",
        "bg-emerald-500", "bg-amber-500", "bg-pink-500",
    ];
    const color = colors[name.charCodeAt(0) % colors.length];
    const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    return (
        <div className={`relative flex-shrink-0`}>
            <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white`}>
                {name.slice(0, 1).toUpperCase()}
            </div>
            {online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            )}
        </div>
    );
};

/* ─── Status Badge ────────────────────────────────────────────────── */
const StatusBadge = ({ isLocked }) =>
    isLocked ? (
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            <FiLock className="w-3 h-3" /> Locked
        </span>
    ) : (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
            <FiUnlock className="w-3 h-3" /> Open
        </span>
    );

/* ═══════════════════════════════════════════════════════════════════ */
function SharedCart() {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    const { userData } = useContext(userDatacontext);
    const { products, currency } = useContext(shopDataContext);

    // ── Auto-join: when navigating via invite link (cartCode or _id),
    //    attempt to join the cart first, then the hook will load it.
    const [joinAttempted, setJoinAttempted] = useState(false);
    useEffect(() => {
        if (!userData || !serverUrl || !cartId) return;
        // Always attempt join — backend returns 200 if already a participant
        axios
            .post(`${serverUrl}/api/sharedcart/join`, { cartCode: cartId }, { withCredentials: true })
            .catch(() => {
                // If join fails (e.g. invalid code), the hook's fetchCart will surface the error
            })
            .finally(() => setJoinAttempted(true));
    }, [cartId, serverUrl, userData]);

    const {
        cart, onlineUserIds, chatMessages, typingUsers,
        loading, error,
        addItem, removeItem, updateQuantity, voteItem,
        sendMessage, sendTyping, toggleLock, removeParticipant,
    } = useSharedCart(joinAttempted ? cartId : null, serverUrl, userData);

    const [chatInput, setChatInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("cart"); // "cart" | "chat"
    const chatEndRef = useRef(null);
    const typingTimer = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const isOwner = cart?.owner?.toString() === userData?._id?.toString();
    // Always share cartCode (the short code) not the MongoDB _id
    const inviteUrl = `${window.location.origin}/shared-cart/${cart?.cartCode || cartId}`;

    const copyInvite = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChatInput = (e) => {
        setChatInput(e.target.value);
        sendTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => sendTyping(false), 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        sendMessage(chatInput.trim());
        setChatInput("");
        sendTyping(false);
    };

    // Enrich cart items with product data
    const enrichedItems = cart?.items?.map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return { ...item, product };
    }) || [];

    const totalAmount = enrichedItems.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#ff3f6c]/30 border-t-[#ff3f6c] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading shared cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-sm">
                    <FiXCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/cart")}
                        className="bg-[#ff3f6c] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e8365d] transition-colors"
                    >
                        Back to My Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FiUsers className="w-5 h-5 text-[#ff3f6c]" />
                        <h1 className="text-lg font-bold text-gray-900">Shared Cart</h1>
                        <StatusBadge isLocked={cart?.isLocked} />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Invite link */}
                        <button
                            onClick={copyInvite}
                            className="flex items-center gap-2 text-sm font-semibold text-[#ff3f6c] border border-[#ff3f6c] rounded-lg px-3 py-1.5 hover:bg-[#ff3f6c] hover:text-white transition-colors"
                        >
                            {copied ? <FiCheckCircle className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Invite"}
                        </button>

                        {/* Owner controls */}
                        {isOwner && (
                            <>
                                <button
                                    onClick={toggleLock}
                                    className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors ${cart?.isLocked
                                        ? "bg-amber-50 text-amber-600 border border-amber-300 hover:bg-amber-100"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {cart?.isLocked ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                                    {cart?.isLocked ? "Unlock" : "Lock"}
                                </button>

                                <button
                                    onClick={() => navigate(`/split-checkout/${cartId}`)}
                                    className="bg-[#ff3f6c] text-white text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-[#e8365d] transition-colors flex items-center gap-2"
                                >
                                    <FiShoppingBag className="w-4 h-4" />
                                    Split & Pay
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">

                    {/* ── Main Area ─────────────────────────────────────────── */}
                    <div className="space-y-6">

                        {/* Participants bar */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FiUsers className="w-4 h-4 text-[#ff3f6c]" />
                                    Participants ({cart?.participants?.length || 0})
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {cart?.participants?.map((p) => {
                                    const isOnline = onlineUserIds.includes(p.userId?.toString());
                                    const isMe = p.userId?.toString() === userData?._id?.toString();
                                    return (
                                        <div
                                            key={p.userId}
                                            className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200"
                                        >
                                            <Avatar name={p.name} size="sm" online={isOnline} />
                                            <span className="text-sm font-medium text-gray-700">
                                                {p.name} {isMe && <span className="text-gray-400">(you)</span>}
                                            </span>
                                            {p.role === "owner" && <FaCrown className="w-3 h-3 text-amber-400" />}
                                            {isOwner && !isMe && (
                                                <button
                                                    onClick={() => removeParticipant(p.userId?.toString())}
                                                    className="text-gray-400 hover:text-red-400 transition-colors ml-1"
                                                >
                                                    <IoMdClose className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tabs (mobile) */}
                        <div className="flex lg:hidden gap-2">
                            {["cart", "chat"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${activeTab === tab
                                        ? "bg-[#ff3f6c] text-white"
                                        : "bg-white text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Cart Items */}
                        <div className={`${activeTab !== "cart" ? "hidden lg:block" : ""}`}>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">
                                        Cart Items ({enrichedItems.length})
                                    </h3>
                                </div>

                                {enrichedItems.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400">
                                        <FiShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                        <p className="font-medium">Cart is empty</p>
                                        <p className="text-sm mt-1">Add products from the shop!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {enrichedItems.map((item) => {
                                            const upCount = item.votes?.up?.length || 0;
                                            const downCount = item.votes?.down?.length || 0;
                                            const isTopVoted = upCount >= 2 && upCount > downCount;
                                            const myVote = item.votes?.up?.includes(userData?._id)
                                                ? "up"
                                                : item.votes?.down?.includes(userData?._id)
                                                    ? "down"
                                                    : null;

                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`p-4 flex gap-4 transition-colors ${isTopVoted ? "bg-emerald-50/50" : ""}`}
                                                >
                                                    {/* Product Image */}
                                                    <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                        {item.product?.image1 ? (
                                                            <img
                                                                src={item.product.image1}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                                    {item.product?.name || "Unknown Product"}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    Size: {item.size}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-0.5">
                                                                    Added by <span className="font-semibold text-gray-600">{item.addedBy?.name || "Someone"}</span>
                                                                </p>
                                                                {isTopVoted && (
                                                                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                        ✨ Most Voted
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                                                                {currency}{(item.product?.price || 0) * item.quantity}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-4 mt-3">
                                                            {/* Quantity controls */}
                                                            {!cart?.isLocked ? (
                                                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                                                                    <button
                                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                        className="p-1.5 hover:bg-gray-100 transition-colors"
                                                                    >
                                                                        <FiMinus className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                        className="p-1.5 hover:bg-gray-100 transition-colors"
                                                                    >
                                                                        <FiPlus className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                            )}

                                                            {/* Vote buttons */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => voteItem(item._id, "up")}
                                                                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${myVote === "up"
                                                                        ? "bg-emerald-500 text-white"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-emerald-100"
                                                                    }`}
                                                                >
                                                                    <FaThumbsUp className="w-3 h-3" />
                                                                    {upCount}
                                                                </button>
                                                                <button
                                                                    onClick={() => voteItem(item._id, "down")}
                                                                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${myVote === "down"
                                                                        ? "bg-red-500 text-white"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-red-100"
                                                                    }`}
                                                                >
                                                                    <FaThumbsDown className="w-3 h-3" />
                                                                    {downCount}
                                                                </button>
                                                            </div>

                                                            {!cart?.isLocked && (
                                                                <button
                                                                    onClick={() => removeItem(item._id)}
                                                                    className="text-gray-400 hover:text-red-400 transition-colors ml-auto"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Cart total */}
                                {enrichedItems.length > 0 && (
                                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">Total</span>
                                        <span className="text-xl font-bold text-gray-900">{currency}{totalAmount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Chat Sidebar ──────────────────────────────────────── */}
                    <div className={`${activeTab !== "chat" ? "hidden lg:flex" : "flex"} flex-col h-[calc(100vh-160px)] bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24`}>
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                            <span className="font-bold text-gray-800">Cart Chat</span>
                            <span className="text-xs text-gray-400">({cart?.participants?.length || 0} members)</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatMessages.length === 0 && (
                                <p className="text-center text-xs text-gray-400 pt-8">
                                    No messages yet. Say hi! 👋
                                </p>
                            )}
                            {chatMessages.map((msg, idx) => {
                                const isMe = msg.userId?.toString() === userData?._id?.toString();
                                return (
                                    <div key={idx} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                        <Avatar name={msg.name} size="sm" />
                                        <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                                            {!isMe && (
                                                <span className="text-xs text-gray-500 mb-0.5 pl-1">{msg.name}</span>
                                            )}
                                            <div className={`rounded-2xl px-3 py-2 text-sm ${isMe
                                                ? "bg-[#ff3f6c] text-white rounded-tr-sm"
                                                : "bg-gray-100 text-gray-800 rounded-tl-sm"
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator */}
                            {typingUsers.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="flex gap-0.5 items-end h-4">
                                        {[0, 0.2, 0.4].map((d, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: `${d}s` }}
                                            />
                                        ))}
                                    </div>
                                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={handleChatInput}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3f6c]/30"
                            />
                            <button
                                type="submit"
                                className="w-9 h-9 bg-[#ff3f6c] text-white rounded-full flex items-center justify-center hover:bg-[#e8365d] transition-colors flex-shrink-0"
                            >
                                <FiSend className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SharedCart;
