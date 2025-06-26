// context/CartContext.js
"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (product) => {
    setCart((prev) => {
      const quantity = prev[product._id]?.quantity || 0;
      return {
        ...prev,
        [product._id]: { ...product, quantity: quantity + 1 },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const quantity = prev[productId]?.quantity || 0;
      if (quantity <= 1) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: quantity - 1,
        },
      };
    });
  };

  const emptyCart = () => setCart({});

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, emptyCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
