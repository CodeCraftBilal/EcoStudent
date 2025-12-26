// components/chat/OrderSidebar/CreateOrderSection.tsx
"use client";

import { DollarSign, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/dashboard/purchase/LocationMap"), {
  ssr: false,
});

interface CreateOrderSectionProps {
  onCreateOrder: (orderData: any) => Promise<void>;
  isOwner: boolean;
}

export default function CreateOrderSection({ onCreateOrder, isOwner }: CreateOrderSectionProps) {
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [meetupLocation, setMeetupLocation] = useState("");
  const [meetupTime, setMeetupTime] = useState("");
  const [tempCoordinates, setTempCoordinates] = useState({ lat: 0, lng: 0 });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!agreedPrice || !meetupLocation) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateOrder({
        agreedPrice,
        meetupLocation,
        meetupLatitude: tempCoordinates.lat || 0,
        meetupLongitude: tempCoordinates.lng || 0,
        meetupTime: meetupTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setTempCoordinates({ lat, lng });
    setMeetupLocation(address);
  };

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
        <p className="text-gray-600 text-center py-8">
          The seller will create an order for this product.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Order</h3>
          <p className="text-gray-600 mb-6">Set the terms for this exchange. Only you (the owner) can edit these details.</p>

          {/* Price Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Agreed Price *
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={agreedPrice || ""}
                onChange={(e) => setAgreedPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 bg-white"
                placeholder="Enter agreed price"
                min="0"
                max="5000"
                step="0.01"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum: $5000</p>
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Meetup Location *
              </div>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={meetupLocation}
                onChange={(e) => setMeetupLocation(e.target.value)}
                className="flex-1 px-4 py-3 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 bg-white"
                placeholder="Enter meetup address"
                required
              />
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="px-4 py-3 bg-eco-50 text-eco-600 border border-eco-200 rounded-lg hover:bg-eco-100 transition-colors"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Time Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Meetup Time
              </div>
            </label>
            <input
              type="datetime-local"
              value={meetupTime}
              onChange={(e) => setMeetupTime(e.target.value)}
              className="w-full px-4 py-3 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 bg-white"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!agreedPrice || !meetupLocation || isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-eco-500 to-eco-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </button>
        </div>
      </div>

      <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        latitude={tempCoordinates.lat}
        longitude={tempCoordinates.lng}
        locationName={meetupLocation || "Select Location"}
        address={meetupLocation}
        selectable={true}
      />
    </>
  );
}