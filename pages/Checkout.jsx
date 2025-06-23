"use client";
import React, { useState } from "react";
import Image from "next/image";

const initialCart = [
  {
    id: 1,
    name: "Jollof Rice",
    price: 2500,
    quantity: 1,
    image: "/image.png",
  },
  {
    id: 2,
    name: "Chapman Drink",
    price: 800,
    quantity: 2,
    image: "/image.png",
  },
];

const Checkout = () => {
  const [cart, setCart] = useState(initialCart);

  const increment = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-500">
                ₦{item.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => decrement(item.id)}
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <span className="font-medium">{item.quantity}</span>
            <button
              onClick={() => increment(item.id)}
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between text-lg font-semibold text-gray-700">
          <span>Total:</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>

        <button className="mt-6 w-full bg-[#AE2108] text-white py-3 rounded-full text-sm font-medium hover:bg-[#941B06] transition">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;
