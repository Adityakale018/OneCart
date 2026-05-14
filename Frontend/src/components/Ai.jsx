import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { userDatacontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSend, FiX, FiShoppingCart, FiMic, FiMicOff } from "react-icons/fi";
import { BsStars, BsRobot } from "react-icons/bs";
import { HiOutlineLightningBolt } from "react-icons/hi";

/* ─── Typing dots animation ───────────────────────────────────────── */
const TypingDots = () => (
    <div className="flex gap-1 items-end h-5">
        {[0, 0.15, 0.3].map((d, i) => (
            <div
                key={i}
                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: `${d}s` }}
            />
        ))}
    </div>
);

/* ─── Product card inside chat ────────────────────────────────────── */
const ProductCard = ({ product, currency, onAddToCart }) => {
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");

    const handleAdd = () => {
        if (!selectedSize && product.sizes?.length > 0) {
            alert("Please select a size");
            return;
        }
        onAddToCart(product._id, selectedSize || "Free Size");
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-32 bg-gray-100 overflow-hidden">
                {product.image1 ? (
                    <img
                        src={product.image1}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
                <div>
                    <p className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2">{product.name}</p>
                    <p className="font-bold text-[#ff3f6c] text-sm mt-1">{currency}{product.price}</p>
                </div>
                {product.reason && (
                    <p className="text-[11px] text-violet-600 bg-violet-50 rounded-lg px-2 py-1 italic">
                        💡 {product.reason}
                    </p>
                )}
                {/* Size selector (show only if product has sizes) */}
                {product.sizes?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {product.sizes.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSelectedSize(s)}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${selectedSize === s
                                    ? "border-[#ff3f6c] bg-[#ff3f6c] text-white"
                                    : "border-gray-300 text-gray-600 hover:border-[#ff3f6c]"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={handleAdd}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${added
                        ? "bg-emerald-500 text-white"
                        : "bg-[#ff3f6c] text-white hover:bg-[#e8365d]"
                    }`}
                >
                    <FiShoppingCart className="w-3 h-3" />
                    {added ? "Added! ✓" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

/* ─── Quick suggestion chips ──────────────────────────────────────── */
const QUICK_SUGGESTIONS = [
    "Gifts under ₹1500",
    "Best sellers",
    "Trending this week",
    "Create a combo under ₹3000",
    "Skincare for oily skin",
    "Best gaming accessories",
];

/* ═══════════════════════════════════════════════════════════════════ */
function Ai() {
    const { addToCart, showSearch, setShowSearch } = useContext(shopDataContext);
    const { serverUrl } = useContext(authDataContext);
    const { userData } = useContext(userDatacontext);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! 👋 I'm your OneCart AI Shopping Assistant. Ask me anything — product recommendations, combos, budget finds, or just say \"Show me trending items\"!",
            products: [],
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(QUICK_SUGGESTIONS);

    // Voice assistant state (preserved from original Ai.jsx)
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Fetch AI suggestions on mount
    useEffect(() => {
        if (!userData || !serverUrl) return;
        axios
            .get(`${serverUrl}/api/ai/suggestions`, { withCredentials: true })
            .then((res) => {
                if (res.data.suggestions?.length > 0) setSuggestions(res.data.suggestions);
            })
            .catch(() => {});
    }, [serverUrl, userData]);

    // ── Voice recognition (preserved from original) ───────────────────────────
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const inst = new SpeechRecognition();
        inst.continuous = false;
        inst.interimResults = false;
        inst.lang = "en-US";
        inst.onstart = () => setIsListening(true);
        inst.onresult = (e) => {
            const text = e.results[0][0].transcript.trim();
            setInput(text);
        };
        inst.onerror = () => setIsListening(false);
        inst.onend = () => setIsListening(false);
        setRecognition(inst);

        return () => inst.abort();
    }, []);

    const toggleVoice = () => {
        if (!recognition) return;
        if (isListening) recognition.stop();
        else {
            recognition.start();
            setIsOpen(true);
        }
    };

    // ── Send message to AI ────────────────────────────────────────────────────
    const sendMessage = useCallback(async (text) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const userMsg = { role: "user", content: trimmed, products: [] };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Build conversation history for Gemini context
            const conversationHistory = messages.slice(-10).map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const res = await axios.post(
                `${serverUrl}/api/ai/chat`,
                { message: trimmed, conversationHistory },
                { withCredentials: true }
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.message,
                    products: res.data.products || [],
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
                    products: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [messages, loading, serverUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleSuggestion = (text) => sendMessage(text);

    const handleAddToCart = (productId, size) => {
        addToCart(productId, size);
    };

    return (
        <>
            {/* ── Floating AI Button ─────────────────────────────────────── */}
            <div className="fixed bottom-[80px] md:bottom-6 left-4 md:left-6 z-50 flex flex-col items-start gap-2">
                {/* Chat open/close button */}
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    className="relative group"
                    title="AI Shopping Assistant"
                >
                    {/* Pulsing ring when chat is open */}
                    {isOpen && (
                        <div className="absolute inset-0 rounded-full bg-[#ff3f6c]/30 animate-ping" />
                    )}
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen
                        ? "bg-[#ff3f6c] rotate-0 scale-110"
                        : "bg-[#ff3f6c] hover:scale-110"
                    }`}>
                        {isOpen ? (
                            <FiX className="w-6 h-6 text-white" />
                        ) : (
                            <BsStars className="w-6 h-6 text-white" />
                        )}
                        {/* Notification dot when chat has unread */}
                        {!isOpen && messages.length > 1 && (
                            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#ff3f6c] rounded-full border-2 border-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* ── Chat Panel ─────────────────────────────────────────────── */}
            <div className={`fixed bottom-[145px] md:bottom-24 left-4 md:left-6 z-50 w-[360px] max-w-[calc(100vw-32px)] transition-all duration-300 ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}>
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
                    style={{ height: "520px" }}>

                    {/* Header */}
                    <div className="bg-[#ff3f6c] px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <BsRobot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-white text-sm">OneCart AI</p>
                            <p className="text-white/80 text-xs">Shopping Assistant • Always on</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <span className="text-emerald-300 text-xs">Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

                        {/* Quick suggestion chips (show only at start) */}
                        {messages.length === 1 && (
                            <div className="mb-2">
                                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                    <HiOutlineLightningBolt className="w-3 h-3" />
                                    Quick suggestions
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestion(s)}
                                            className="text-xs bg-white border border-[#ff3f6c]/20 text-[#ff3f6c] px-3 py-1.5 rounded-full hover:bg-[#ff3f6c]/5 hover:border-[#ff3f6c]/40 transition-colors font-medium"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                                {/* Avatar */}
                                {msg.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-full bg-[#ff3f6c] flex items-center justify-center flex-shrink-0 mt-1">
                                        <BsRobot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}

                                <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    {/* Text bubble */}
                                    {msg.content && (
                                        <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-[#ff3f6c] text-white rounded-tr-sm"
                                            : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                                        }`}>
                                            {msg.content}
                                        </div>
                                    )}

                                    {/* Product recommendation cards */}
                                    {msg.products?.length > 0 && (
                                        <div>
                                            <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                                                <BsStars className="w-3 h-3 text-[#ff3f6c]" />
                                                Recommended for you
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {msg.products.slice(0, 4).map((product) => (
                                                    <ProductCard
                                                        key={product._id}
                                                        product={product}
                                                        currency="₹"
                                                        onAddToCart={handleAddToCart}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading (AI typing indicator) */}
                        {loading && (
                            <div className="flex gap-2 items-end">
                                <div className="w-7 h-7 rounded-full bg-[#ff3f6c] flex items-center justify-center flex-shrink-0">
                                    <BsRobot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="bg-white border-t border-gray-100 p-3">
                        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                            <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={loading}
                                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-9 h-9 bg-[#ff3f6c] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
                            >
                                <FiSend className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Powered by Gemini AI · OneCart Assistant
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ai;