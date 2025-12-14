// components/dashboard/purchase/LocationMap.tsx
"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Navigation, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  locationName: string;
  address?: string;
}

export default function LocationMap({
  isOpen,
  onClose,
  latitude,
  longitude,
  locationName,
  address,
}: LocationMapProps) {
  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Generate OpenStreetMap static image URL
      const osmUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=16&size=600x400&markers=${latitude},${longitude},red&layer=mapnik`;
      setMapUrl(osmUrl);

      // Generate Google Maps URL for directions
      const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      setGoogleMapsUrl(gMapsUrl);
    }
  }, [isOpen, latitude, longitude]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-eco-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-eco-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-eco-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Meetup Location
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {locationName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-eco-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Address */}
                {address && (
                  <div className="mb-6 p-4 bg-eco-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-1">Address</p>
                    <p className="font-medium text-gray-900">{address}</p>
                  </div>
                )}

                {/* Map */}
                <div className="mb-6 rounded-lg overflow-hidden border border-eco-200">
                  {mapUrl ? (
                    <img
                      src={mapUrl}
                      alt="Location Map"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-eco-50 to-eco-blue-50 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-eco-400 mx-auto mb-3" />
                        <p className="text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-white border-t border-eco-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-eco-coral rounded-full"></div>
                        <span>Meetup Point</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-eco-600 rounded-full"></div>
                        <span>Your Location</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Latitude</p>
                    <p className="font-mono text-sm text-gray-900">
                      {latitude}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Longitude</p>
                    <p className="font-mono text-sm text-gray-900">
                      {longitude}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-eco-500 to-eco-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Open in Google Maps
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${latitude}, ${longitude}`
                      );
                      // You could add a toast notification here
                    }}
                    className="flex-1 border border-eco-200 text-eco-600 font-medium py-3 px-4 rounded-lg hover:bg-eco-50 transition-colors"
                  >
                    Copy Coordinates
                  </button>
                </div>

                {/* Additional Information */}
                <div className="mt-6 pt-6 border-t border-eco-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Meeting Instructions
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-eco-500 rounded-full mt-1.5"></div>
                      <span>Meet at the exact marked location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-eco-500 rounded-full mt-1.5"></div>
                      <span>Bring exact change if paying in cash</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-eco-500 rounded-full mt-1.5"></div>
                      <span>Verify the item before completing the purchase</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}