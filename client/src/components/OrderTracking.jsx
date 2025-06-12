import React from "react";
import { useEffect } from "react";

const OrderTracking = ({ deliveryStatus }) => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      key: "processing",
      label: "Processing",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      key: "out_for_delivery",
      label: "Out for Delivery",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18m-5-5h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
  ];

  // Normalize deliveryStatus to lowercase to match keys in steps
  const normalizedStatus = deliveryStatus ? deliveryStatus.toLowerCase() : "";

  // Find index of current status, fallback to 0 if not found
  const currentIndex = Math.max(
    0,
    steps.findIndex(step => step.key === normalizedStatus)
  );

  // Generate tracking ID (random for demo purposes)
  const trackingId = `#${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Package Journey
        </h2>
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-gray-600 mr-2">Tracking ID:</span>
          <span className="font-mono font-bold text-gray-900">{trackingId}</span>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="relative mb-12">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline steps */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-1 bg-gray-200 -z-10"></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const statusText = isCompleted ? "Completed" : isActive ? "Current Status" : "Pending";

          return (
            <div
              key={step.key}
              className={`flex flex-col md:flex-row items-center mb-10 last:mb-0 transition-all duration-300 ${isActive ? "scale-105" : ""}`}
            >
              {/* Left side (mobile) / Top side (desktop) */}
              <div className="w-full md:w-1/2 md:pr-10 md:text-right mb-4 md:mb-0 order-1 md:order-1">
                {index % 2 === 0 && (
                  <div className={`p-5 rounded-2xl shadow-lg border ${isActive
                      ? "bg-white border-blue-300 transform -translate-x-1 md:translate-x-0"
                      : isCompleted
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200 opacity-75"
                    }`}>
                    <div className="flex items-center md:justify-end">
                      {isActive && <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></span>}
                      <span className={`font-semibold ${isActive ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-500"}`}>
                        {step.label}
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-2 text-sm text-gray-600 md:text-right">
                        Your package is currently in this status
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Center point */}
              <div className="w-12 h-12 flex-shrink-0 mx-4 order-2 md:order-2 relative">
                <div className={`absolute inset-0 rounded-full flex items-center justify-center shadow-md border-4 transition-all ${isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? "bg-white border-blue-500 text-blue-500 animate-pulse"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded ${isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                  }`}>
                  {statusText}
                </div>
              </div>

              {/* Right side (mobile) / Bottom side (desktop) */}
              <div className="w-full md:w-1/2 md:pl-10 order-3 md:order-3">
                {index % 2 !== 0 && (
                  <div className={`p-5 rounded-2xl shadow-lg border ${isActive
                      ? "bg-white border-blue-300 transform translate-x-1 md:translate-x-0"
                      : isCompleted
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200 opacity-75"
                    }`}>
                    <div className="flex items-center">
                      {isActive && <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></span>}
                      <span className={`font-semibold ${isActive ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-500"}`}>
                        {step.label}
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-2 text-sm text-gray-600">
                        Your package is currently in this status
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery details */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
        {/* <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="bg-white p-4 rounded-xl shadow-md border border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
              {currentIndex >= steps.length - 1
                ? "Delivery Completed!"
                : "Estimated Delivery"}
            </h3>
            <br />
            <p className="text-gray-600 mb-4">
              {currentIndex >= steps.length - 1
                ? "Your package has been successfully delivered."
                : `Expected arrival: ${new Date(Date.now() + (currentIndex + 1) * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
              }
            </p>
            <div className="flex justify-center md:justify-end space-x-2">
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div> */}

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    
    {/* ETA Info */}
    <div className="flex items-center space-x-4">
      <div className="bg-white p-3 rounded-xl shadow-md border border-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {currentIndex >= steps.length - 1 ? "Delivery Completed!" : "Estimated Delivery"}
        </h3>
        <p className="text-sm text-gray-600">
          {currentIndex >= steps.length - 1
            ? "Your package has been successfully delivered."
            : `Expected arrival: ${new Date(Date.now() + (currentIndex + 1) * 86400000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}`}
        </p>
      </div>
    </div>

    {/* Contact Support Button */}
    <div className="flex justify-center md:justify-end">
      <button className="flex items-center gap-2 px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79V12a9 9 0 10-9 9h.79M16 16l-4-4-4 4" />
        </svg>
        Contact Support
      </button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default OrderTracking;
