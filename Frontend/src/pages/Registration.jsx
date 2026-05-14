import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/vcart_logo.png";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { FiMail, FiLock, FiUser, FiShield } from "react-icons/fi";
import { authDataContext } from "../context/AuthContext";
import { userDatacontext } from "../context/UserContext";
import axios from "axios";

/* Password strength indicator */
const getStrength = (p) => {
  if (!p) return { level: 0, label: '', color: '' }
  if (p.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-400' }
  if (p.length < 10 || !/[0-9]/.test(p)) return { level: 2, label: 'Fair', color: 'bg-amber-400' }
  return { level: 3, label: 'Strong', color: 'bg-emerald-500' }
}

function Registration() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const { getCurrentUser } = useContext(userDatacontext);
  const strength = getStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(serverUrl + "/api/auth/registration", { name, email, password }, { withCredentials: true });
      getCurrentUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#ff3f6c] to-rose-400 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <img src={Logo} alt="OneCart" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Join OneCart</h1>
          <p className="text-rose-100 text-lg mb-8">Shop smarter, live better</p>
          <div className="space-y-3 text-left">
            {[
              "✅ Free account — no credit card needed",
              "🎁 Welcome offer on first order",
              "📦 Track all your orders in one place",
              "💬 Priority customer support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3">
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-[#ff3f6c] rounded-xl flex items-center justify-center">
            <img src={Logo} alt="logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900">OneCart</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Create account 🎉</h2>
            <p className="text-gray-500 mt-2">Join millions of happy shoppers on OneCart</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text" required minLength={2}
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-12 border border-gray-300 rounded-xl pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff3f6c] focus:ring-2 focus:ring-[#ff3f6c]/10 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 border border-gray-300 rounded-xl pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff3f6c] focus:ring-2 focus:ring-[#ff3f6c]/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type={show ? "text" : "password"} required minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full h-12 border border-gray-300 rounded-xl pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff3f6c] focus:ring-2 focus:ring-[#ff3f6c]/10 transition-all"
                />
                <button type="button" onClick={() => setShow(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {show ? <IoEye className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${strength.color}`}
                      style={{ width: `${(strength.level / 3) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${strength.level === 3 ? 'text-emerald-600' : strength.level === 2 ? 'text-amber-500' : 'text-red-500'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full h-12 bg-[#ff3f6c] hover:bg-[#e8365d] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff3f6c]/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#ff3f6c] font-bold hover:underline">
              Sign In
            </button>
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <FiShield className="w-3.5 h-3.5" />
            By registering, you agree to OneCart's Terms & Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
