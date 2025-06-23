"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1000)); // Simulate delay

      const newProduct = {
        ...formData,
        id: Date.now(),
        imagePreview: formData.image
          ? URL.createObjectURL(formData.image)
          : null,
      };

      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added");
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null,
      });
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toaster position="top-right" />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
        >
          <ArrowLeftCircle size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#AE2108] mb-4">
            Add Product
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
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#AE2108] hover:bg-[#941B06]"
              }`}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Product List
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {prod.imagePreview && (
                    <img
                      src={prod.imagePreview}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-[#AE2108]">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-gray-600">₦{prod.price}</p>
                    <p className="text-xs text-gray-400">{prod.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
