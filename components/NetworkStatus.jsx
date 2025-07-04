"use client"; // if using app directory, safe to include. Optional in /pages

import { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: isOnline ? "#4caf50" : "#f44336",
        color: "#fff",
        textAlign: "center",
        padding: "10px",
        zIndex: 9999,
      }}
    >
      {isOnline
        ? "✅ You are back online"
        : "⚠️ You are offline. Please check your internet connection."}
    </div>
  );
};

export default NetworkStatus;
