// components/chat/OrderSidebar/CreateOrderSection.tsx
"use client";

import { DollarSign, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("@/components/dashboard/purchase/LocationMap"),
  { ssr: false }
);

interface CreateOrderSectionProps {
  onCreateOrder: (orderData: any) => Promise<void>;
  isOwner: boolean;
}

type FieldErrors = {
  agreedPrice?: string;
  meetupLocation?: string;
  meetupTime?: string;
};

/* ==================== CUSTOM FORM HOOK ==================== */
function useFormValidation() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (values: {
    agreedPrice: number;
    meetupLocation: string;
    meetupTime: string;
  }): boolean => {
    const newErrors: FieldErrors = {};

    if (!values.agreedPrice || values.agreedPrice <= 0) {
      newErrors.agreedPrice = "Agreed price must be greater than 0";
    }

    if (!values.meetupLocation.trim()) {
      newErrors.meetupLocation = "Meetup location is required";
    } else if (values.meetupLocation.trim().length < 5) {
      newErrors.meetupLocation =
        "Meetup location must be at least 5 characters long";
    } else if (values.meetupLocation.trim().length > 90) {
      newErrors.meetupLocation =
        "Meetup location must be at smaller than 90 characters";
    }

    if (values.meetupTime && new Date(values.meetupTime) < new Date()) {
      newErrors.meetupTime = "Meetup time cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return { errors, validate, clearError };
}

/* ==================== COMPONENT ==================== */
export default function CreateOrderSection({
  onCreateOrder,
  isOwner,
}: CreateOrderSectionProps) {
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [meetupLocation, setMeetupLocation] = useState("");
  const [meetupTime, setMeetupTime] = useState("");
  const [tempCoordinates, setTempCoordinates] = useState({ lat: 0, lng: 0 });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors, validate, clearError } = useFormValidation();

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    const isValid = validate({
      agreedPrice,
      meetupLocation,
      meetupTime,
    });

    if (!isValid) return;

    try {
      setIsSubmitting(true);
      await onCreateOrder({
        agreedPrice,
        meetupLocation,
        meetupLatitude: tempCoordinates.lat || 0,
        meetupLongitude: tempCoordinates.lng || 0,
        meetupTime:
          meetupTime ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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
    clearError("meetupLocation");
  };

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Details
        </h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Order
          </h3>

          {/* ---------------- PRICE ---------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {/* <DollarSign className="inline w-4 h-4 mr-1" /> */}
              <h1 className="inline font-extrabold w-4 h-4 mr-1"> RS</h1>
              Agreed Price *
            </label>

            <input
              type="number"
              value={agreedPrice || ""}
              onChange={(e) => {
                setAgreedPrice(Number(e.target.value) || 0);
                clearError("agreedPrice");
              }}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.agreedPrice
                  ? "border-red-500 focus:ring-red-500"
                  : "border-eco-200 focus:ring-eco-500"
              }`}
            />

            {errors.agreedPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.agreedPrice}</p>
            )}
          </div>

          {/* ---------------- LOCATION ---------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Meetup Location *
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={meetupLocation}
                onChange={(e) => {
                  setMeetupLocation(e.target.value);
                  clearError("meetupLocation");
                }}
                className={`flex-1 px-4 py-3 border rounded-lg ${
                  errors.meetupLocation
                    ? "border-red-500 focus:ring-red-500"
                    : "border-eco-200 focus:ring-eco-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="px-4 py-3 bg-eco-50 border rounded-lg"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {errors.meetupLocation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.meetupLocation}
              </p>
            )}
          </div>

          {/* ---------------- TIME ---------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Meetup Time
            </label>

            <input
              type="datetime-local"
              value={meetupTime}
              onChange={(e) => {
                setMeetupTime(e.target.value);
                clearError("meetupTime");
              }}
              className="w-full px-4 py-3 border border-eco-200 rounded-lg"
            />

            {errors.meetupTime && (
              <p className="text-sm text-red-500 mt-1">{errors.meetupTime}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-eco-500 text-white rounded-lg disabled:opacity-50"
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
        selectable
      />
    </>
  );
}
