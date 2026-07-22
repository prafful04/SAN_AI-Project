import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Analyzing code...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Shield */}
      <div className="relative mb-4">
        <div className={`${sizeClasses[size]} text-blue-600 animate-pulse`}>
          <Shield size={size === 'sm' ? 24 : size === 'md' ? 48 : 64} />
        </div>
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan"></div>
        </div>
        
        {/* Rotating Ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-t-blue-400 rounded-full animate-spin`}></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 w-48 bg-gray-200 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-progress"></div>
      </div>
    </div>
  );
};