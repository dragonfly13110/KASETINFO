import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      <p className="ml-4 text-lg text-gray-700">กำลังโหลดข้อมูล...</p>
    </div>
  );
};

export default LoadingSpinner;
