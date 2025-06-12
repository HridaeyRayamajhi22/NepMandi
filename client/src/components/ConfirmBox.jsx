import React from 'react';
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({ 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  cancel, 
  confirm, 
  close, 
  loading = false, // add loading prop
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={close} 
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500">
          <IoClose size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={cancel}
            disabled={loading} // disable when loading
            className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={loading} // disable when loading
            className={`px-4 py-2 rounded text-white transition ${
              loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;