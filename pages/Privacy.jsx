import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f4ef] via-[#fff] to-[#f2f2f2] py-12 px-4 sm:px-6 lg:px-8 text-[#AE2108]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#AE2108]">
          Privacy Policy
        </h1>

        {[
          {
            title: "1. Who This Policy Applies To",
            content: (
              <p className="text-base leading-relaxed">
                This Privacy Policy applies to both{" "}
                <span className="font-medium">Customers</span> who use ChowSpace
                to discover and order meals, and{" "}
                <span className="font-medium">Vendors</span> who run their food
                businesses on our platform. We are committed to protecting the
                information of every user.
              </p>
            ),
          },
          {
            title: "2. What Information We Collect",
            content: (
              <ul className="list-disc pl-5 space-y-1">
                <li>Full name, email, and phone number</li>
                <li>Delivery addresses and location data (for customers)</li>
                <li>Business details and bank info (for vendors)</li>
                <li>Order history and support messages</li>
              </ul>
            ),
          },
          {
            title: "3. How We Use Your Data",
            content: (
              <>
                <p className="text-base leading-relaxed">
                  We use your data to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Process and deliver food orders</li>
                  <li>Verify and onboard vendors</li>
                  <li>Provide customer support</li>
                  <li>Improve platform performance and features</li>
                </ul>
              </>
            ),
          },
          {
            title: "4. Sharing and Security",
            content: (
              <p className="text-base leading-relaxed">
                We never sell your data. Your information is stored securely and
                only shared with third parties (like payment processors) when
                necessary to complete a transaction or ensure platform safety.
              </p>
            ),
          },
          {
            title: "5. Your Control & Rights",
            content: (
              <p className="text-base leading-relaxed">
                You can update or delete your data at any time by going to your
                profile. If you’re a vendor, you can manage your public
                information, product listings, and bank details securely.
              </p>
            ),
          },
          {
            title: "6. Contact Us",
            content: (
              <p className="text-base leading-relaxed">
                If you have questions about this policy or how your data is
                used, reach out to us at{" "}
                <a
                  href="mailto:support@chowspace.com"
                  className="underline hover:text-[#881a06]"
                >
                  support@chowspace.com
                </a>
                .
              </p>
            ),
          },
        ].map((section, index) => (
          <div
            key={index}
            className="bg-white border border-[#f2f2f2] rounded-xl shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <div className="text-[#AE2108]">{section.content}</div>
          </div>
        ))}

        <footer className="text-center text-sm text-gray-400 pt-8">
          &copy; {new Date().getFullYear()} ChowSpace. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
