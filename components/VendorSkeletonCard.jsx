import React from "react";

const VendorSkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
      {/* Top Image Section */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content Section */}
      <div className="p-4">
        {/* Business Name */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />

        {/* Location */}
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />

        {/* Stars */}
        <div className="h-4 bg-yellow-100 rounded w-24 mb-3" />

        {/* Status pill */}
        <div className="h-5 bg-gray-300 rounded-full w-20 mb-3" />

        {/* Button */}
        <div className="h-8 bg-gray-300 rounded w-full" />
      </div>
    </div>
  );
};

export default VendorSkeletonCard;
