"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 1000;
  const total = subtotal + delivery;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Order</h1>
        <p className="text-gray-600 text-sm">
          Review your items before checkout.
        </p>
      </div>

      {/* Vendor Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.jpg"
            alt="Vendor Logo"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mama Ope Kitchen
            </h2>
            <p className="text-sm text-gray-500">African Dishes • 4.8 ⭐</p>
          </div>
        </div>

        <Link
          href="/vendors"
          className="text-[#AE2108] text-sm font-medium underline hover:text-[#941B06]"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Cart Items */}
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
              <h3 className="font-medium text-gray-800">{item.name}</h3>
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

      {/* Summary */}
      <div className="mt-8 border-t pt-6 space-y-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>₦{delivery.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-base text-gray-800 border-t pt-4">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button className="mt-8 w-full bg-[#AE2108] text-white py-3 rounded-full text-sm font-medium hover:bg-[#941B06] transition">
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
