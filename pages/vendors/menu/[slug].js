"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import {
  ArrowLeftCircle,
  Plus,
  Minus,
  Trash2,
  CopyPlus,
  ShoppingCart,
  PackagePlus,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

import Head from "next/head";
const VendorMenuPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const canonicalUrl = `https://chowspace.ng/vendors/menu/${slug ?? ""}`;
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2005";

  const {
    cart,
    currentPackIndex,
    addToCart,
    removeFromCart,
    incrementItem,
    createPack,
    duplicatePack,
    switchPack,
    emptyCart,
  } = useCart();

  const currentPack = cart[currentPackIndex] || [];
  const total = currentPack.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
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
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <>
      <Head>
        <title>
          {vendor
            ? `${vendor.businessName} | Menu | ChowSpace`
            : "Menu | ChowSpace"}
        </title>
        <meta
          name="description"
          content={
            vendor
              ? `View the full menu from ${vendor.businessName} on ChowSpace. Order delicious meals from ${vendor.location}.`
              : "Explore delicious meals from your favorite vendors on ChowSpace."
          }
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://chowspace.ng/vendors/menu/${slug}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={
            vendor
              ? `${vendor.businessName} | Menu | ChowSpace`
              : "Menu | ChowSpace"
          }
        />
        <meta
          property="og:description"
          content={
            vendor
              ? `Check out ${vendor.businessName}'s menu and order easily on ChowSpace.`
              : "Order from top vendors with ease on ChowSpace."
          }
        />
        <meta
          property="og:url"
          content={`https://chowspace.ng/vendors/menu/${slug}`}
        />
        <meta
          property="og:image"
          content={vendor?.logo || "https://chowspace.ng/og-preview.jpg"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            vendor
              ? `${vendor.businessName} | Menu | ChowSpace`
              : "Menu | ChowSpace"
          }
        />
        <meta
          name="twitter:description"
          content={
            vendor
              ? `Hungry? Browse and order from ${vendor.businessName}'s menu on ChowSpace.`
              : "Delicious meals from local vendors on ChowSpace."
          }
        />
        <meta
          name="twitter:image"
          content={vendor?.logo || "https://chowspace.ng/og-preview.jpg"}
        />
      </Head>

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
                  loading="lazy"
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

          <div className="flex flex-wrap gap-2 mb-6">
            {cart.map((_, index) => (
              <button
                key={index}
                onClick={() => switchPack(index)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-150 ${
                  index === currentPackIndex
                    ? "bg-[#AE2108] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ShoppingCart size={16} className="inline-block mr-1" /> Pack{" "}
                {index + 1}
              </button>
            ))}
            <button
              onClick={createPack}
              className="px-3 py-1 bg-[#AE2108] text-white rounded-full text-sm flex items-center gap-1"
            >
              <PackagePlus size={16} /> New Pack
            </button>
            <button
              onClick={() => duplicatePack(currentPackIndex)}
              className="px-3 py-1 bg-[#AE2108] text-white rounded-full text-sm flex items-center gap-1"
            >
              <CopyPlus size={16} /> Duplicate
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => {
                const item = currentPack.find((p) => p._id === product._id);
                const count = item ? item.quantity : 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200"
                  >
                    <div className="w-full h-28 relative">
                      <Image
                        loading="lazy"
                        src={product.image || "https://placehold.co/150x150"}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-3">
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
                          product.available ? "text-[#AE2108]" : "text-red-500"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </p>

                      {count > 0 ? (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium">{count}</span>
                          <button
                            onClick={() => incrementItem(product._id)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.available}
                          className={`mt-2 w-full py-1 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                            product.available
                              ? "bg-[#AE2108] text-white hover:bg-[#941B06]"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Plus size={14} /> Order
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

          {currentPack.length > 0 && (
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                Your Order
              </h3>
              <ul className="divide-y text-sm">
                {currentPack.map((item) => (
                  <li key={item._id} className="py-2 flex justify-between">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-semibold text-[#AE2108]">
                      ₦{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4 font-semibold text-base">
                <span>Total:</span>
                <span className="text-[#AE2108]">₦{total}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={emptyCart}
                  className="text-sm bg-gray-200 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-1"
                >
                  <Trash2 size={16} /> Empty
                </button>
                <button
                  onClick={() => router.push(`/checkout/${slug}`)}
                  className="text-sm bg-[#AE2108] text-white hover:bg-[#941B06] px-4 py-2 rounded flex items-center gap-1"
                >
                  <ShoppingCart size={16} /> Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VendorMenuPage;
