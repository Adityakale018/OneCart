import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDatacontext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import axios from "axios";
import {
    FiUsers, FiCheckCircle, FiClock, FiAlertCircle,
    FiDollarSign, FiPercent, FiList, FiBox,
} from "react-icons/fi";

/* ─── Step Indicator ──────────────────────────────────────────────── */
const Step = ({ num, label, active, done }) => (
    <div className="flex flex-col items-center gap-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${done ? "bg-emerald-500 text-white" : active ? "bg-[#ff3f6c] text-white" : "bg-gray-200 text-gray-500"}`}>
            {done ? <FiCheckCircle className="w-4 h-4" /> : num}
        </div>
        <span className={`text-xs font-medium ${active ? "text-[#ff3f6c]" : "text-gray-500"}`}>{label}</span>
    </div>
);

const StepDivider = ({ done }) => (
    <div className={`flex-1 h-px mt-4 transition-colors ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
);

/* ─── Payment Status Badge ────────────────────────────────────────── */
const PaymentBadge = ({ status }) => {
    const map = {
        paid: { icon: FiCheckCircle, label: "Paid", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        pending: { icon: FiClock, label: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-200" },
        failed: { icon: FiAlertCircle, label: "Failed", cls: "bg-red-50 text-red-500 border-red-200" },
    };
    const { icon: Icon, label, cls } = map[status] || map.pending;
    return (
        <span className={`flex items-center gap-1 text-xs font-semibold border px-2 py-1 rounded-full ${cls}`}>
            <Icon className="w-3 h-3" />{label}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
function SplitCheckout() {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    const { userData } = useContext(userDatacontext);
    const { products, currency } = useContext(shopDataContext);

    const [step, setStep] = useState(1); // 1: mode, 2: assign, 3: pay
    const [cart, setCart] = useState(null);
    const [splitMode, setSplitMode] = useState("equal");
    const [splitDoc, setSplitDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [error, setError] = useState("");
    const [razorpayReady, setRazorpayReady] = useState(false);

    /* Participant share amounts (local state for step 2) */
    const [assignments, setAssignments] = useState([]);

    // Load Razorpay SDK dynamically
    useEffect(() => {
        if (window.Razorpay) { setRazorpayReady(true); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayReady(true);
        script.onerror = () => setError("Failed to load payment gateway");
        document.head.appendChild(script);
        return () => { /* script stays for session */ };
    }, []);

    // Fetch shared cart
    useEffect(() => {
        if (!cartId) return;
        axios.get(`${serverUrl}/api/sharedcart/${cartId}`, { withCredentials: true })
            .then((res) => {
                setCart(res.data.cart);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load cart");
                setLoading(false);
            });
    }, [cartId, serverUrl]);

    // Compute total from cart items
    const totalAmount = cart?.items?.reduce((sum, item) => {
        const prod = products.find((p) => p._id === item.productId);
        return sum + (prod?.price || 0) * item.quantity;
    }, 0) || 0;

    // Build initial assignments when cart or mode changes
    useEffect(() => {
        if (!cart) return;
        const participants = cart.participants || [];
        const equalShare = participants.length ? +(totalAmount / participants.length).toFixed(2) : 0;
        setAssignments(
            participants.map((p) => ({
                userId: p.userId,
                name: p.name,
                amount: equalShare,
                percentage: +(100 / participants.length).toFixed(1),
                assignedProductIds: [],
                status: "pending",
            }))
        );
    }, [cart, totalAmount]);

    // Recompute amounts when mode changes
    const recalculate = (mode, currentAssignments) => {
        if (mode === "equal") {
            const share = +(totalAmount / currentAssignments.length).toFixed(2);
            return currentAssignments.map((a) => ({ ...a, amount: share, percentage: +(100 / currentAssignments.length).toFixed(1) }));
        }
        return currentAssignments;
    };

    const handleModeChange = (mode) => {
        setSplitMode(mode);
        setAssignments((prev) => recalculate(mode, prev));
    };

    const updateAssignment = (idx, field, value) => {
        setAssignments((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            // If percentage mode: recompute amount
            if (field === "percentage" && splitMode === "percentage") {
                updated[idx].amount = +((totalAmount * value) / 100).toFixed(2);
            }
            return updated;
        });
    };

    // Create split payment document
    const handleCreateSplit = async () => {
        try {
            setError("");
            setLoading(true);
            const res = await axios.post(
                `${serverUrl}/api/splitpayment/create`,
                { sharedCartId: cart._id, totalAmount, splitMode, splits: assignments },
                { withCredentials: true }
            );
            setSplitDoc(res.data.splitPayment);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create split");
        } finally {
            setLoading(false);
        }
    };

    // Load Razorpay and pay for one participant
    const handlePay = async (splitEntryId, entryAmount) => {
        if (!razorpayReady) {
            setError("Payment gateway is still loading. Please wait a moment.");
            return;
        }
        try {
            setPayingId(splitEntryId);
            const orderRes = await axios.post(
                `${serverUrl}/api/splitpayment/${splitDoc._id}/pay`,
                { splitEntryId },
                { withCredentials: true }
            );
            const { razorpayOrderId, amount, currency: cur, key } = orderRes.data;

            const options = {
                key,
                amount,
                currency: cur,
                name: "OneCart Split Payment",
                description: `Your share: ${currency}${entryAmount}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            `${serverUrl}/api/splitpayment/verify`,
                            {
                                splitId: splitDoc._id,
                                splitEntryId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            },
                            { withCredentials: true }
                        );
                        setSplitDoc(verifyRes.data.splitPayment);
                    } catch {
                        setError("Payment verification failed");
                    }
                },
                prefill: { name: userData?.name, email: userData?.email },
                theme: { color: "#ff3f6c" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || "Payment initiation failed");
        } finally {
            setPayingId(null);
        }
    };

    if (loading && !splitDoc) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#ff3f6c]/30 border-t-[#ff3f6c] rounded-full animate-spin" />
            </div>
        );
    }

    const SPLIT_MODES = [
        { id: "equal", label: "Equal Split", desc: "Everyone pays the same amount", icon: FiUsers },
        { id: "percentage", label: "Percentage", desc: "Assign % share to each person", icon: FiPercent },
        { id: "custom", label: "Custom Amount", desc: "Enter exact amounts manually", icon: FiDollarSign },
        { id: "item-based", label: "Item Based", desc: "Assign specific items to each person", icon: FiBox },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Split Payment Checkout</h1>
                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                        <Step num={1} label="Mode" active={step === 1} done={step > 1} />
                        <StepDivider done={step > 1} />
                        <Step num={2} label="Assign" active={step === 2} done={step > 2} />
                        <StepDivider done={step > 2} />
                        <Step num={3} label="Pay" active={step === 3} done={splitDoc?.allPaid} />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 font-medium">
                        {error}
                    </div>
                )}

                {/* ── Step 1: Choose Mode ─────────────────────────────────── */}
                {step === 1 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-1">Choose Split Mode</h2>
                        <p className="text-sm text-gray-500 mb-5">
                            Total: <span className="font-bold text-gray-900">{currency}{totalAmount}</span> among {cart?.participants?.length} people
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {SPLIT_MODES.map(({ id, label, desc, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => handleModeChange(id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitMode === id
                                        ? "border-[#ff3f6c] bg-rose-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${splitMode === id ? "bg-[#ff3f6c] text-white" : "bg-gray-100 text-gray-600"}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="mt-6 w-full h-11 bg-[#ff3f6c] text-white font-semibold rounded-lg hover:bg-[#e8365d] transition-colors"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* ── Step 2: Assign Amounts ──────────────────────────────── */}
                {step === 2 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-1">Assign Shares</h2>
                        <p className="text-sm text-gray-500 mb-5">
                            Total: <span className="font-bold text-gray-900">{currency}{totalAmount}</span>
                        </p>

                        <div className="space-y-3">
                            {assignments.map((a, idx) => (
                                <div key={a.userId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-9 h-9 rounded-full bg-[#ff3f6c] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {a.name?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                                        {a.userId?.toString() === userData?._id?.toString() && (
                                            <p className="text-xs text-gray-400">You</p>
                                        )}
                                    </div>
                                    {/* Amount input based on mode */}
                                    {splitMode === "equal" ? (
                                        <span className="font-bold text-gray-900">{currency}{a.amount}</span>
                                    ) : splitMode === "percentage" ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={a.percentage}
                                                onChange={(e) => updateAssignment(idx, "percentage", +e.target.value)}
                                                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-[#ff3f6c]"
                                            />
                                            <span className="text-gray-500 text-sm">%</span>
                                            <span className="text-gray-700 text-sm ml-1">= {currency}{a.amount}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-600 text-sm">{currency}</span>
                                            <input
                                                type="number"
                                                min={0}
                                                value={a.amount}
                                                onChange={(e) => updateAssignment(idx, "amount", +e.target.value)}
                                                className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#ff3f6c]"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Total check */}
                        <div className="mt-4 flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span className="text-gray-500">Assigned total</span>
                            <span className={`font-bold ${Math.abs(assignments.reduce((s, a) => s + a.amount, 0) - totalAmount) < 1 ? "text-emerald-600" : "text-red-500"}`}>
                                {currency}{assignments.reduce((s, a) => s + a.amount, 0).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 h-11 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleCreateSplit}
                                disabled={loading}
                                className="flex-1 h-11 bg-[#ff3f6c] text-white font-semibold rounded-lg hover:bg-[#e8365d] transition-colors disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : "Confirm & Proceed →"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Pay ─────────────────────────────────────────── */}
                {step === 3 && splitDoc && (
                    <div className="space-y-4">
                        {splitDoc.allPaid && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                                <FiCheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-emerald-800">All payments completed! 🎉</p>
                                    <p className="text-sm text-emerald-600">Your order is being processed.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900">Payment Status</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Total: <span className="font-bold">{currency}{splitDoc.totalAmount}</span>
                                </p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {splitDoc.splits.map((split) => {
                                    const isMe = split.userId?.toString() === userData?._id?.toString();
                                    return (
                                        <div key={split._id} className="px-5 py-4 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#ff3f6c]/10 text-[#ff3f6c] flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {split.name?.slice(0, 1).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {split.name} {isMe && <span className="text-gray-400">(you)</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{currency}{split.amount.toFixed(2)}</p>
                                            </div>
                                            <PaymentBadge status={split.status} />
                                            {isMe && split.status === "pending" && (
                                                <button
                                                    onClick={() => handlePay(split._id, split.amount)}
                                                    disabled={payingId === split._id}
                                                    className="ml-2 bg-[#ff3f6c] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#e8365d] transition-colors disabled:opacity-60"
                                                >
                                                    {payingId === split._id ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : "Pay Now"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SplitCheckout;
