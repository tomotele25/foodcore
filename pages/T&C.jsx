import React from "react";

const Terms = () => {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using ChowSpace, both vendors and customers agree to these Terms & Conditions. Continued use of our platform indicates full acceptance.",
    },
    {
      title: "2. Vendor Charges & Commission",
      content:
        "ChowSpace charges vendors a commission of 5% per successful order. This includes payment processing and platform service fees. Vendors are responsible for managing their product listings and fulfilling orders professionally.",
    },
    {
      title: "3. Customer Responsibilities",
      content:
        "Customers must provide accurate delivery details, select from available delivery options, and complete payment before an order is processed. Orders placed are binding once confirmed by a vendor.",
    },
    {
      title: "4. Refund & Cancellation Policy",
      content:
        "Refunds are processed based on vendor approval and dispute resolution outcome. Customers may cancel an order before it’s accepted by the vendor, after which refund requests require vendor validation.",
    },
    {
      title: "5. Dispute Resolution",
      content:
        "If a customer or vendor encounters issues (e.g., incorrect delivery, poor service), ChowSpace provides a dispute resolution system. All parties are expected to cooperate fairly, and decisions by ChowSpace will be binding.",
    },
    {
      title: "6. Account Security",
      content:
        "Vendors and customers are responsible for the security of their accounts. Do not share login credentials. Any suspicious activity should be reported immediately to ChowSpace support.",
    },
    {
      title: "7. Changes to Terms",
      content:
        "ChowSpace reserves the right to modify these terms at any time. We’ll notify users of major updates, and continued use of our services implies acceptance of the revised terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-10 md:px-20 lg:px-40">
      <h1 className="text-3xl md:text-4xl font-bold text-[#AE2108] mb-10 text-center">
        Terms & Conditions
      </h1>
      <div className="grid gap-6">
        {terms.map((section, index) => (
          <div
            key={index}
            className="bg-[#FFF2F0] border border-[#AE2108]/20 shadow-sm rounded-2xl p-6 transition duration-300 hover:shadow-md"
          >
            <h2 className="text-lg md:text-xl font-semibold text-[#AE2108] mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
