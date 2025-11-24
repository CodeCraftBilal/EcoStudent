// components/Loading/PageLoader.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  title?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
}

const PageLoader: React.FC<PageLoaderProps> = ({
  title = "Loading EcoStudent",
  subtitle = "Getting things ready for you...",
  size = "medium"
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-eco-50 to-eco-blue-50 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-eco-500 to-eco-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">ES</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EcoStudent</h1>
        </div>

        {/* Loading Animation */}
        <LoadingSpinner size={size} />

        {/* Text Content */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 max-w-sm mx-auto">{subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto bg-eco-100 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-eco-500 to-eco-blue-500 h-2 rounded-full animate-pulse"
            style={{
              width: '65%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          ></div>
        </div>

        {/* Tips */}
        <div className="mt-8 text-sm text-gray-500 space-y-1">
          <p>💡 Tip: You can exchange books with students nearby</p>
          <p>🌱 Helping the environment with every exchange</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;