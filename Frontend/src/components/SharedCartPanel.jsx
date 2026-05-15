import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { FiUsers, FiCopy, FiCheckCircle, FiLink } from "react-icons/fi";
import axios from "axios";

/**
 * Floating panel on the Cart page that lets users create a shared cart
 * or join one via an invite code.
 */
function SharedCartPanel() {
    const { serverUrl } = useContext(authDataContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const [showJoin, setShowJoin] = useState(false);

    const handleCreateSharedCart = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.post(
                `${serverUrl}/api/sharedcart/create`,
                {},
                { withCredentials: true }
            );
            const { cart } = res.data;
            navigate(`/shared-cart/${cart._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create shared cart");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSharedCart = async (e) => {
        e.preventDefault();
        let code = joinCode.trim();
        if (!code) return;

        // If user pastes the full URL, extract the code
        if (code.includes("/shared-cart/")) {
            const parts = code.split("/");
            code = parts[parts.length - 1];
        }

        try {
            setLoading(true);
            setError("");
            const res = await axios.post(
                `${serverUrl}/api/sharedcart/join`,
                { cartCode: code },
                { withCredentials: true }
            );
            navigate(`/shared-cart/${res.data.cart._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid invite code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 rounded-xl border-2 border-dashed border-[#ff3f6c]/30 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ff3f6c]/10 flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-[#ff3f6c]" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Shop Together!</h3>
                    <p className="text-xs text-gray-500">
                        Invite friends to shop in the same cart in real time
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 mb-3 font-medium">{error}</p>
            )}

            <div className="flex flex-col gap-2">
                {/* Create shared cart */}
                <button
                    onClick={handleCreateSharedCart}
                    disabled={loading}
                    className="w-full h-10 bg-[#ff3f6c] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#e8365d] transition-colors disabled:opacity-60"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <FiUsers className="w-4 h-4" />
                            Create Shared Cart
                        </>
                    )}
                </button>

                {/* Join with code */}
                <button
                    onClick={() => setShowJoin((v) => !v)}
                    className="w-full h-10 bg-white text-[#ff3f6c] border border-[#ff3f6c] text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
                >
                    <FiLink className="w-4 h-4" />
                    Join with Invite Code
                </button>

                {showJoin && (
                    <form onSubmit={handleJoinSharedCart} className="flex gap-2 mt-1">
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            placeholder="Enter invite code..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff3f6c]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#ff3f6c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e8365d] transition-colors disabled:opacity-60"
                        >
                            Join
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SharedCartPanel;
