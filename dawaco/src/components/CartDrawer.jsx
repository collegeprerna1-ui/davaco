import React, { useState } from "react";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartDrawer = ({ isOpen, onClose, onOpenAuth }) => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, checkout } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) return;
    setCheckingOut(true);
    const success = await checkout(address);
    setCheckingOut(false);
    if (success) {
      setAddress("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              🛒 Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <span className="text-5xl mb-4">🛒</span>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Explore our range of medicines to add items!</p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg font-medium transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const id = item.medicineId || item.id;
                return (
                  <div
                    key={id}
                    className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    {/* Medicine Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.type}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="px-3 text-xs font-semibold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs transition"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-green-600">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-gray-400 hover:text-red-600 transition self-start mt-1 p-1 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
              <div className="flex items-center justify-between font-bold text-gray-800 text-base">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">
                {totalAmount >= 500
                  ? "🎉 You qualify for FREE shipping!"
                  : `Add ₹${(500 - totalAmount).toFixed(2)} more for free delivery (else +₹50)`}
              </p>

              {user ? (
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter delivery address in detail..."
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={checkingOut}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md disabled:opacity-50"
                  >
                    {checkingOut ? "Processing Order..." : "Place Order & Pay"}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-center text-red-500 font-medium">
                    ⚠️ You must be logged in to complete checkout
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm text-center block shadow-md"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
