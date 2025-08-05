"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  ArrowLeftCircle,
  Plus,
  X,
  LayoutDashboard,
  PackageOpen,
  LogOut,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ManageProducts() {
  const router = useRouter();
  const { data: session } = useSession();
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2005";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    available: true,
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/product/my-products`, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    if (session?.user?.accessToken) fetchProducts();
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.productName,
      price: product.price,
      category: product.category,
      description: product.description || "",
      available: product.available,
      image: null,
      imagePreview: product.image.startsWith("http")
        ? product.image
        : `${BACKENDURL}/uploads/${product.image}`,
    });
    setEditId(product._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("productName", formData.name);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("available", formData.available);
      if (formData.image) form.append("image", formData.image);

      const url = editMode
        ? `${BACKENDURL}/api/product/update/${editId}`
        : `${BACKENDURL}/api/product/createProduct`;

      const method = editMode ? "patch" : "post";

      const res = await axios({
        method,
        url,
        data: form,
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(editMode ? "Product updated" : "Product added");
      setProducts((prev) => {
        if (editMode) {
          return prev.map((p) => (p._id === editId ? res.data.product : p));
        } else {
          return [res.data.product, ...prev];
        }
      });

      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        available: true,
        image: null,
        imagePreview: null,
      });
      setEditMode(false);
      setEditId(null);
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit product");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (productId) => {
    try {
      const res = await axios.patch(
        `${BACKENDURL}/api/product/${productId}/toggle-availability`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      const updatedProduct = res.data.product;
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      toast.success(
        `Product is now ${
          updatedProduct.available ? "Available" : "Unavailable"
        }`
      );
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* ... Sidebar and header skipped for brevity ... */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <h2 className="text-xl font-bold text-[#AE2108] mb-6">
            Vendor Panel
          </h2>
          <nav className="space-y-3">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              href="/vendor/products"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <PackageOpen size={18} /> Products
            </Link>
          </nav>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/Login" })}
          className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      {/* Product Grid */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
          >
            <ArrowLeftCircle size={18} />
            <span>Back</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            products.map((prod) => (
              <div
                key={prod._id}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-sm relative"
              >
                {prod.image && (
                  <img
                    src={
                      prod.image.startsWith("http")
                        ? prod.image
                        : `${BACKENDURL}/uploads/${prod.image}`
                    }
                    alt={prod.productName}
                    className="w-full h-28 object-cover rounded-md mb-2"
                  />
                )}
                <h3 className="font-semibold text-[#AE2108] truncate">
                  {prod.productName}
                </h3>
                <p className="text-gray-600 text-xs">₦{prod.price}</p>
                <p className="text-gray-400 text-xs mb-2">{prod.category}</p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      prod.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {prod.available ? "Available" : "Unavailable"}
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prod.available}
                      onChange={() => handleToggle(prod._id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-red-400 peer-checked:bg-green-500 rounded-full relative transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 left-0.5 peer-checked:translate-x-5 transform transition-transform" />
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => handleEdit(prod)}
                  className="absolute top-2 right-2  text-gray-500 hover:text-[#AE2108]"
                >
                  <Pencil size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setFormData({
                    name: "",
                    price: "",
                    category: "",
                    description: "",
                    available: true,
                    image: null,
                    imagePreview: null,
                  });
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-[#AE2108] mb-4">
                {editMode ? "Edit Product" : "Add Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="text"
                  name="price"
                  placeholder="Price (₦)"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="African">African</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Pastry">Pastry</option>
                  <option value="Rice Dishes">Rice Dishes</option>
                  <option value="Swallows">Swallows</option>
                  <option value="Soups & Stews">Soups & Stews</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Grilled/Fried">Grilled/Fried</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Smoothies">Smoothies</option>
                  <option value="Small Chops">Small Chops</option>
                  <option value="Shawarma & Sandwiches">
                    Shawarma & Sandwiches
                  </option>
                  <option value="Bakery">Bakery</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <label className="text-sm text-gray-700">Available</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>

                  <label
                    htmlFor="imageUpload"
                    className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-lg text-gray-600 cursor-pointer hover:border-[#AE2108] hover:text-[#AE2108]"
                  >
                    {formData.image
                      ? "Change Image"
                      : "Click to select an image"}
                  </label>

                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {formData.imagePreview && (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-40 object-cover rounded-md"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#AE2108] hover:bg-[#941B06]"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : editMode
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-[#AE2108] hover:bg-[#941B06] text-white p-4 rounded-full shadow-lg z-50"
        >
          <Plus size={24} />
        </button>
      </main>
    </div>
  );
}
