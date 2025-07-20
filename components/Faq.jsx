"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is ChowSpace?",
    answer:
      "ChowSpace is a food delivery and vendor platform where you can order meals from your favorite vendors and have them delivered fast and fresh.",
  },
  {
    question: "How do I become a vendor?",
    answer:
      "Sign up and complete the onboarding process. Once approved, your store will go live immediately.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept credit/debit cards, bank transfers, and mobile payments through Paystack and Flutterwave.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We currently deliver in major cities across Nigeria and are expanding rapidly.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl bg-white shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-800 hover:bg-gray-50 transition"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`px-6 pb-4 text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
