import React, { useState } from "react";
import { FaTimes, FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      if (!name) {
        setLoading(false);
        return;
      }
      success = await register(name, email, password);
    }

    setLoading(false);
    if (success) {
      // Clear inputs
      setName("");
      setEmail("");
      setPassword("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[400px] rounded-2xl p-6 relative shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Logo Icon */}
        <div className="flex justify-center mb-3">
          <div className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-xl text-white text-2xl font-bold">
            💊
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome to DaWaCo
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          {isLogin ? "Sign in to manage your health needs" : "Create a new account"}
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              isLogin ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              !isLogin ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {isLogin && (
            <div className="text-right text-xs text-blue-600 hover:underline cursor-pointer">
              Forgot Password?
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition shadow-lg shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400 font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3">
          <button className="flex-1 border border-gray-200 hover:bg-gray-50 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-medium transition">
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button className="flex-1 border border-gray-200 hover:bg-gray-50 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-medium transition">
            <FaFacebook className="text-blue-600" /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
