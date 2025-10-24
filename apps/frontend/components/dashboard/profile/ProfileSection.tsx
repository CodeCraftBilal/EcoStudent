"use client";

import { ReactNode } from "react";

interface ProfileSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function ProfileSection({ 
  title, 
  description, 
  children, 
  className = "" 
}: ProfileSectionProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}