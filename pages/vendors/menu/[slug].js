"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { ArrowLeftCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

const VendorMenuPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";

  const { cart, addToCart, removeFromCart, emptyCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${BACKENDURL}/api/product/vendor/slug/${slug}`
        );

        if (!res.data.success) {
          setError("Vendor or products not found");
          return;
        }

        setVendor(res.data.vendor);
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const cartItems = Object.values(cart);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-[#AE2108]"
        >
          <ArrowLeftCircle size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {vendor && (
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 relative rounded-full overflow-hidden border">
              <Image
                src={vendor.logo || "/logo.jpg"}
                alt={vendor.businessName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {vendor.businessName}
              </h1>
              <p className="text-sm text-gray-500">{vendor.location}</p>
              <p className="text-xs text-gray-400 mt-1">{vendor.category}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => {
              const inCart = cart[product._id]?.quantity || 0;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-md shadow-sm overflow-hidden text-sm"
                >
                  <div className="w-full h-28 relative">
                    <Image
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${BACKENDURL}/uploads/${product.image}`
                      }
                      alt={product.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {product.category}
                    </p>
                    <p className="text-sm text-[#AE2108] font-semibold">
                      ₦{product.price}
                    </p>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        product.available ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </p>

                    {inCart > 0 ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="px-2 py-1 text-sm bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{inCart}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="px-2 py-1 text-sm bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.available}
                        className={`mt-2 w-full py-1 rounded text-xs font-medium ${
                          product.available
                            ? "bg-[#AE2108] text-white hover:bg-[#941B06]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No items on the menu yet.</p>
        )}

        {cartItems.length > 0 && (
          <div className="mt-10 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Your Order</h3>
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li key={item._id} className="py-2 flex justify-between">
                  <div>
                    {item.productName} × {item.quantity}
                  </div>
                  <div>₦{item.price * item.quantity}</div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 font-semibold">
              <span>Total:</span>
              <span>₦{total}</span>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={emptyCart}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Empty Cart
              </button>
              <button
                onClick={() => router.push(`/checkout/${slug}`)}
                className="text-sm bg-[#AE2108] text-white hover:bg-[#941B06] px-4 py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VendorMenuPage;
