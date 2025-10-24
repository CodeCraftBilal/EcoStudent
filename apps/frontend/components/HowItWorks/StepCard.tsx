// components/HowItWorks/StepCard.tsx
import React from 'react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
  icon,
  features
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-green-100">
      {/* Step Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
            {stepNumber}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Features List */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-700">
            <svg 
              className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Progress Line (for visual flow) */}
      {stepNumber < 6 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-green-300 transform -translate-y-1/2" />
      )}
    </div>
  );
};

export default StepCard;