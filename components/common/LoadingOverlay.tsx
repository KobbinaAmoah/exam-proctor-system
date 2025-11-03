import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
};

export default LoadingOverlay;
