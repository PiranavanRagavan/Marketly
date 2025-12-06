import { useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  id: string;
  quantity: number;
}

const CART_STORAGE_KEY = "marketly-cart";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: product.id, quantity }];
    });
  };

  const addMultipleToCart = (items: Array<{ productId: string; quantity: number }>) => {
    setCartItems((prev) => {
      const newCart = [...prev];
      items.forEach((item) => {
        const existing = newCart.find((cartItem) => cartItem.id === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          newCart.push({ id: item.productId, quantity: item.quantity });
        }
      });
      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    addMultipleToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  };
};
