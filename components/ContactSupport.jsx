"use client";
import { useState } from "react";
import { Headset, X } from "lucide-react";

const topics = [
  "Orders & Deliveries",
  "Payments & Refunds",
  "Account & Login Issues",
  "Vendor Menus or Food",
  "App or Website Bugs",
  "Other Questions",
];

export default function ContactSupport() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-[#AE2108] hover:bg-red-800 text-white p-3 rounded-full shadow-lg"
        title="Contact ChowSpace Support"
      >
        <Headset className="w-5 h-5" />
      </button>

      {/* Support Modal (Bottom Left) */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in">
          <div className="p-4 border-b flex justify-between items-center bg-[#AE2108] rounded-t-xl">
            <h2 className="text-white font-semibold text-base">
              ChowSpace Help
            </h2>
            <button
              onClick={() => {
                setOpen(false);
                setSelected(null);
              }}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto text-sm text-gray-800 space-y-4">
            {!selected ? (
              <>
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">👋 Hi there!</p>
                  <p>Welcome to ChowSpace Support.</p>
                  <p className="text-gray-600">How can we help you today?</p>
                </div>

                <div className="space-y-2 mt-3">
                  {topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelected(topic)}
                      className="w-full text-left bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-gray-800 shadow-sm transition"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-gray-400 mt-4 italic">
                  * You can always go back and choose another option *
                </p>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">
                    ✅ Topic Selected:
                  </p>
                  <div className="bg-gray-100 text-gray-900 p-2 rounded-md">
                    {selected}
                  </div>
                  <p>
                    Thanks for reaching out! Your inquiry about{" "}
                    <strong>{selected}</strong> has been noted. A ChowSpace team
                    member will get back to you shortly.
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * For urgent matters, please email support@chowspace.com *
                  </p>

                  <button
                    onClick={() => setSelected(null)}
                    className="text-[#AE2108] mt-4 underline text-sm hover:text-red-700"
                  >
                    ⬅️ Go back to topics
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
