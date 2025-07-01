import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const BACKENDURL = "http://localhost:2006";

export default function PaymentRedirect() {
  const router = useRouter();
  const { reference, transaction_id } = router.query;

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference && !transaction_id) return;

    const verifyPayment = async () => {
      try {
        const ref = reference || transaction_id;

        const res = await axios.post(`${BACKENDURL}/api/verify-payment`, {
          reference: ref,
        });

        if (res.data.success) {
          setStatus("success");
          setMessage("Payment verified successfully! Your order is confirmed.");
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("An error occurred while verifying payment.");
      }
    };

    verifyPayment();
  }, [reference, transaction_id]);

  const handleGoHome = () => router.push("/");
  const handleViewOrders = () => router.push("/orders");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {status === "loading" && (
        <p className="text-lg text-gray-700">Verifying payment...</p>
      )}

      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful 🎉
          </h1>
          <p className="mb-6 text-gray-700 text-center max-w-md">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={handleViewOrders}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Orders
            </button>
            <button
              onClick={handleGoHome}
              className="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
            >
              Go Home
            </button>
          </div>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Failed ❌
          </h1>
          <p className="mb-6 text-gray-700 text-center max-w-md">{message}</p>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
          >
            Go Home
          </button>
        </>
      )}
    </div>
  );
}
