// components/ProductSkeleton.jsx
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      {/* Image Placeholder */}
      <div className="bg-gray-200 h-40 w-full rounded-md mb-4"></div>

      {/* Title Placeholder */}
      <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>

      {/* Price Placeholder */}
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
    </div>
  );
};

export default ProductSkeleton;
