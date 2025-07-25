import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2006";

const PromotionVerification = () => {
  const router = useRouter();
  const { reference } = router.query;
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!reference) return;

    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${BACKENDURL}/api/paystack/verify-promote`,
          {
            reference,
          }
        );

        if (res.data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error(error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="p-10 text-center">
      {status === "verifying" && <p>Verifying promotion...</p>}
      {status === "success" && (
        <p className="text-green-600">Promotion activated 🎉</p>
      )}
      {status === "failed" && (
        <p className="text-red-600">Verification failed ❌</p>
      )}
    </div>
  );
};

export default PromotionVerification;
