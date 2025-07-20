"use client";

import React from "react";
import { PackageCheck, Clock, Truck, ReceiptText } from "lucide-react";

const dummyOrders = [
  {
    id: "CHOW-1001",
    vendor: "Jollof Express",
    items: ["Jollof Rice", "Grilled Chicken"],
    total: 4500,
    status: "Completed",
    createdAt: "July 18, 2025",
  },
  {
    id: "CHOW-1002",
    vendor: "Pasta Hub",
    items: ["Creamy Alfredo", "Garlic Bread"],
    total: 6000,
    status: "Pending",
    createdAt: "July 19, 2025",
  },
];

const CustomersOrder = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-[#AE2108] flex items-center gap-2">
        <ReceiptText className="w-6 h-6" />
        My Orders
      </h1>

      {dummyOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 mb-5 p-5"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {order.vendor}
            </h2>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                order.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Order Ref: <span className="font-medium">{order.id}</span>
          </p>

          <ul className="text-sm text-gray-700 mb-3 list-disc list-inside">
            {order.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <div className="flex justify-between text-sm text-gray-600">
            <p>Total: ₦{order.total.toLocaleString()}</p>
            <p className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {order.createdAt}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomersOrder;
