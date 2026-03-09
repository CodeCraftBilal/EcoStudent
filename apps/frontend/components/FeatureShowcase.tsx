"use client";

import { useEffect, useState } from "react";
import { MapPin, MessageCircle, Search, Shield } from "lucide-react";

export function FeatureShowcase() {
    const [currentFeature, setCurrentFeature] = useState(0);

    const features = [
        {
            icon: <MapPin className="w-8 h-8" />,
            title: "Location-Based Exchange",
            description: "Find students nearby for easy, safe book exchanges",
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: "Real-time Chat",
            description: "Text and voice chat to negotiate exchanges",
        },
        {
            icon: <Search className="w-8 h-8" />,
            title: "AI-Powered Search",
            description: "Smart search with image recognition and recommendations",
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure Payments",
            description: "Integrated JazzCash & Easypaisa for safe transactions",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="aspect-square bg-linear-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                        {features[currentFeature].icon}
                        <h3 className="text-xl font-semibold text-gray-900">
                            {features[currentFeature].title}
                        </h3>
                        <p className="text-gray-600">
                            {features[currentFeature].description}
                        </p>
                    </div>
                </div>

                {/* Feature Indicators */}
                <div className="flex justify-center space-x-2">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentFeature(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentFeature ? "bg-green-600" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
