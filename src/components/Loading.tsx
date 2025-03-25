
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="h-12 w-12 text-fsms-blue animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
      <p className="text-gray-500 mt-2">Please wait while we prepare your data</p>
    </div>
  );
};

export default Loading;
