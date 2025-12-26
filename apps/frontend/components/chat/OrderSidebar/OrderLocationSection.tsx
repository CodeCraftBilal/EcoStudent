// components/chat/OrderSidebar/OrderLocationSection.tsx
"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the LocationMap component to avoid SSR issues
const LocationMap = dynamic(() => import("@/components/dashboard/purchase/LocationMap"), {
  ssr: false,
});

interface OrderLocationSectionProps {
  location: string;
  latitude: number;
  longitude: number;
  isOwner: boolean;
  isEditing: boolean;
  onUpdate: (updates: any) => Promise<void>;
}

export default function OrderLocationSection({
  location,
  latitude,
  longitude,
  isOwner,
  isEditing,
  onUpdate
}: OrderLocationSectionProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [editedLocation, setEditedLocation] = useState(location);
  const [tempCoordinates, setTempCoordinates] = useState({ lat: latitude, lng: longitude });
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setTempCoordinates({ lat, lng });
    setEditedLocation(address);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate({
        meetupLocation: editedLocation,
        meetupLatitude: tempCoordinates.lat,
        meetupLongitude: tempCoordinates.lng
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Meetup Location
          </h4>
          <button
            onClick={() => setIsMapOpen(true)}
            className="text-sm text-eco-600 hover:text-eco-700 flex items-center gap-1"
          >
            View Map
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {isEditing && isOwner ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-eco-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
              placeholder="Enter meetup address"
            />
            <button
              onClick={() => setIsMapOpen(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-eco-200 text-eco-600 rounded-lg hover:bg-eco-50 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Pick Location on Map
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editedLocation}
              className="w-full px-4 py-3 bg-gradient-to-r from-eco-500 to-eco-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Location"}
            </button>
          </div>
        ) : (
          <div className="p-3 bg-eco-50 rounded-lg border border-eco-200">
            <p className="text-gray-900">{location}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>Lat: {latitude.toFixed(6)}</span>
              <span>•</span>
              <span>Lng: {longitude.toFixed(6)}</span>
            </div>
          </div>
        )}
      </div>

      <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={isEditing ? handleLocationSelect : undefined}
        latitude={tempCoordinates.lat || latitude}
        longitude={tempCoordinates.lng || longitude}
        locationName={editedLocation || location}
        address={editedLocation || location}
        selectable={isEditing}
      />
    </>
  );
}