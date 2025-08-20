"use client";

import React, { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2005";

const Packaging = () => {
  const router = useRouter();
  const [packName, setPackName] = useState("");
  const [packPrice, setPackPrice] = useState("");
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const managerId = session?.user?.id;

  const addPack = async (e) => {
    e.preventDefault();
    if (!packName || !packPrice) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKENDURL}/managers/${managerId}/packs`,
        {
          name: packName,
          fee: Number(packPrice),
        }
      );

      setPacks(res.data.vendor.packs);
      setPackName("");
      setPackPrice("");
    } catch (error) {
      console.error(
        "Error adding pack:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const removePack = (idx) => {
    setPacks(packs.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-orange-600 hover:text-orange-800"
      >
        <ArrowLeft className="mr-2" /> Go Back
      </button>

      <h1 className="text-2xl font-bold">Packaging Options</h1>

      <form
        onSubmit={addPack}
        className="flex flex-col sm:flex-row sm:items-end gap-4 bg-white rounded-lg p-4 shadow"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Pack Name</label>
          <input
            type="text"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
            placeholder="e.g. Plastic Small"
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium mb-1">Fee</label>
          <input
            type="number"
            value={packPrice}
            onChange={(e) => setPackPrice(e.target.value)}
            placeholder="₦"
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded px-4 py-2 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Current Packs</h2>
        {packs.length === 0 ? (
          <p className="text-gray-500">No packaging options added yet.</p>
        ) : (
          <ul className="space-y-2">
            {packs.map((p, idx) => (
              <li
                key={idx}
                className="bg-gray-50 flex justify-between p-3 rounded shadow-sm"
              >
                <span>
                  {p.name} — <span className="font-semibold">₦{p.fee}</span>
                </span>
                <button
                  onClick={() => removePack(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Packaging;
