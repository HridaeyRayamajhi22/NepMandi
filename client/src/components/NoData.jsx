import React from 'react';
import noDataImage from '../assets/nothinghereyet.png';

const NoData = () => {
  return (
    <div className="flex justify-center items-center flex-col p-20 bg-gray-100">
      <img
        src={noDataImage}
        alt="no data"
        className="w-32 h-32 object-contain"  // Adjusting size for a smaller image
      />
      <p className="text-neutral-500 text-sm mt-2">No data</p>  {/* Added margin and small text size */}
    </div>
  );
};

export default NoData;
