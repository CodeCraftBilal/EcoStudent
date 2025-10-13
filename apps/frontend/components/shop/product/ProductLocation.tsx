import { MapPin } from "lucide-react";

interface ProductLocationProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  distance: number;
}

export default function ProductLocation({ location, distance }: ProductLocationProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Meetup Location</h3>
      <div className="flex items-center space-x-2 mb-4 text-gray-700">
        <MapPin className="w-5 h-5 text-green-600" />
        <span>{location.address}</span>
      </div>
      <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-green-600" />
          <p>Interactive Map</p>
          <p className="text-sm">Showing location: {location.address}</p>
          <p className="text-sm">{distance} km from your location</p>
        </div>
      </div>
    </div>
  );
}