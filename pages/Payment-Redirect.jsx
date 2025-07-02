"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CheckCircle,
  Truck,
  Home,
  ReceiptText,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export default function OrderConfirmed() {
  const router = useRouter();
  const [timer, setTimer] = useState(30);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) setOrder(JSON.parse(storedOrder));
  }, []);

  const handleGoHome = () => router.push("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-2xl w-full text-center relative overflow-hidden">
        <CheckCircle size={50} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-4">
          Your payment was successful. Your delicious order is on its way 🚚
        </p>

        {order && (
          <div className="bg-gray-100 rounded-lg p-4 text-left mt-6 mb-6">
            <h2 className="text-lg font-semibold text-[#AE2108] mb-3">
              Order Summary
            </h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 relative rounded overflow-hidden border">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₦{item.price}
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-sm text-gray-700 flex items-center gap-2 mt-3">
                <MapPin size={16} /> <span>{order.guestInfo?.address}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-6 text-[#AE2108] font-medium">
          <Truck size={20} />
          <span>Estimated delivery in {timer}s...</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-5 py-2 border border-[#AE2108] text-[#AE2108] rounded-md hover:bg-red-50 transition"
          >
            <Home size={18} /> Go Home
          </button>
        </div>

        <ShoppingBag
          size={120}
          className="absolute right-[-20px] bottom-[-20px] text-[#fcd8d4] rotate-12 opacity-10"
        />
      </div>
    </div>
  );
}
