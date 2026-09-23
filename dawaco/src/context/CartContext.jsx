import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load guest cart from localStorage initially
  useEffect(() => {
    if (!user) {
      const savedCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCartItems(savedCart);
    }
  }, [user]);

  // Synchronize/Fetch cart when user status changes
  useEffect(() => {
    const syncAndFetchCart = async () => {
      if (user && token) {
        setLoading(true);
        try {
          // If we had guest items, sync them to backend first
          const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
          if (guestCart.length > 0) {
            const syncRes = await fetch("/api/cart/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: guestCart.map(item => ({
                  medicineId: item.medicineId || item.id,
                  quantity: item.quantity
                }))
              }),
            });
            if (syncRes.ok) {
              localStorage.removeItem("guest_cart");
            }
          }

          // Fetch fresh cart from DB
          const response = await fetch("/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          }
        } catch (err) {
          console.error("Error syncing cart:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    syncAndFetchCart();
  }, [user, token]);

  // Helper to save guest cart to localStorage
  const saveGuestCart = (items) => {
    setCartItems(items);
    localStorage.setItem("guest_cart", JSON.stringify(items));
  };

  const addToCart = async (medicine, quantity = 1) => {
    const medId = medicine.id || medicine.medicineId;
    if (user && token) {
      try {
        const existing = cartItems.find((item) => (item.medicineId || item.id) === medId);
        const newQty = existing ? existing.quantity + quantity : quantity;
        
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ medicineId: medId, quantity: newQty }),
        });

        if (response.ok) {
          // Refresh cart from backend to ensure consistent state
          const fetchRes = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            setCartItems(data);
          }
          toast.success(`${medicine.name} added to cart!`);
        } else {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to add to cart");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      // Guest local storage
      const existing = cartItems.find((item) => (item.medicineId || item.id) === medId);
      let updatedCart = [];
      if (existing) {
        updatedCart = cartItems.map((item) =>
          (item.medicineId || item.id) === medId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...cartItems,
          {
            medicineId: medId,
            id: medId,
            name: medicine.name,
            price: medicine.price,
            discount: medicine.discount,
            image: medicine.image,
            type: medicine.type || "Tablet",
            quantity,
          },
        ];
      }
      saveGuestCart(updatedCart);
      toast.success(`${medicine.name} added to cart!`);
    }
  };

  const updateQuantity = async (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    if (user && token) {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ medicineId, quantity }),
        });
        if (response.ok) {
          setCartItems((prev) =>
            prev.map((item) =>
              (item.medicineId || item.id) === medicineId
                ? { ...item, quantity }
                : item
            )
          );
        } else {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to update quantity");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const updatedCart = cartItems.map((item) =>
        (item.medicineId || item.id) === medicineId
          ? { ...item, quantity }
          : item
      );
      saveGuestCart(updatedCart);
    }
  };

  const removeFromCart = async (medicineId) => {
    if (user && token) {
      try {
        const response = await fetch(`/api/cart/${medicineId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setCartItems((prev) =>
            prev.filter((item) => (item.medicineId || item.id) !== medicineId)
          );
          toast.success("Item removed from cart");
        }
      } catch (err) {
        toast.error("Failed to remove item");
      }
    } else {
      const updatedCart = cartItems.filter(
        (item) => (item.medicineId || item.id) !== medicineId
      );
      saveGuestCart(updatedCart);
      toast.success("Item removed from cart");
    }
  };

  const clearCart = async () => {
    if (user && token) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems([]);
      } catch (err) {
        console.error(err);
      }
    } else {
      saveGuestCart([]);
    }
  };

  const checkout = async (address) => {
    if (!user || !token) {
      toast.error("Please sign in or create an account to checkout.");
      return false;
    }
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems([]);
        toast.success("Order placed successfully! Check your email for details.");
        return true;
      } else {
        throw new Error(data.message || "Failed to checkout");
      }
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        totalAmount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
