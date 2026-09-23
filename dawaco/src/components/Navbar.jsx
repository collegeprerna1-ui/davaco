import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaSearch,
  FaBell,
  FaShoppingCart,
  FaUser,
  FaUpload,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import DawacoLogo from "../assets/DawacoLogo.png";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import UploadModal from "./UploadModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const [openAuth, setOpenAuth] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchVal)}`);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>

      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-xs flex justify-between px-6 md:px-10 py-2">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <FaPhoneAlt size={10} /> Customer Care: 1800-XXX-XXXX
          </span>
          <span className="flex items-center gap-2">
            <FaEnvelope size={10} /> dawaco75@gmail.com
          </span>
        </div>
        <div className="hidden sm:block">Free Delivery on orders above ₹500</div>
      </div>

      {/* Main Navbar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-4 gap-4 shadow-md bg-white sticky top-0 z-40">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer shrink-0">
          <img src={DawacoLogo} className="w-10 rounded-lg" alt="DaWaCo Logo" />
          <div>
            <h1 className="text-xl font-bold text-blue-600 tracking-wide">DaWaCo</h1>
            <p className="text-[10px] text-gray-500 font-medium">Your Health Partner</p>
          </div>
        </Link>

        {/* Location Dropdown */}
        <div className="hidden lg:flex flex-col text-xs">
          <span className="text-gray-400 font-semibold">Deliver to</span>
          <select className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-gray-50 text-gray-700 outline-none">
            <option>Select Location</option>
            <option>Mumbai</option>
            <option>Pune</option>
            <option>Delhi</option>
            <option>Bangalore</option>
          </select>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center border border-gray-300 hover:border-gray-400 focus-within:border-blue-500 rounded-xl overflow-hidden w-full md:max-w-md transition-colors"
        >
          <input
            type="text"
            placeholder="Search for medicines, vitamins..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="px-4 py-2 w-full outline-none text-sm text-gray-700"
          />
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 hover:bg-blue-700 transition">
            <FaSearch size={14} />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 xl:gap-6 text-sm w-full md:w-auto">
          {/* Reminder Link */}
          <Link
            to="/reminder"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition"
          >
            <FaBell className="text-blue-500" /> Reminder
          </Link>

          {/* Upload Prescription */}
          <button
            onClick={() => setOpenUpload(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition shadow-md shadow-green-500/10 text-xs sm:text-sm active:scale-[0.98]"
          >
            <FaUpload /> Upload Prescription
          </button>

          {/* Shopping Cart Icon */}
          <div
            onClick={() => setOpenCart(true)}
            className="relative cursor-pointer text-gray-700 hover:text-blue-600 transition p-2 bg-gray-100 rounded-full"
          >
            <FaShoppingCart className="text-base sm:text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Sign In / Profile dropdown */}

          {user ? (
  <div className="flex items-center gap-3 pl-2 border-l border-gray-200">

    <div
      onClick={() => navigate("/profile")}
      className="flex flex-col text-right hidden sm:flex cursor-pointer hover:text-blue-600 transition"
    >
      <span className="text-xs font-bold text-gray-800 line-clamp-1">
        {user.name}
      </span>

      <span className="text-[10px] text-gray-400 line-clamp-1">
        {user.email}
      </span>
    </div>

    <button
      onClick={() => navigate("/profile")}
      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 p-2.5 rounded-full transition"
      title="My Profile"
    >
      <FaUser />
    </button>

    <button
      onClick={logout}
      className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 p-2.5 rounded-full transition"
      title="Log Out"
    >
      <FaSignOutAlt />
    </button>

  </div>
) : (
            <button
              onClick={() => setOpenAuth(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition shadow-md shadow-blue-500/10 active:scale-[0.98]"
            >
              <FaUser /> Sign Up / Login
            </button>
          )}
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <AuthModal isOpen={openAuth} onClose={() => setOpenAuth(false)} />
      
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        onOpenAuth={() => setOpenAuth(true)}
      />

      <UploadModal
        isOpen={openUpload}
        onClose={() => setOpenUpload(false)}
        onOpenAuth={() => setOpenAuth(true)}
      />
    </>
  );
};

export default Navbar;
