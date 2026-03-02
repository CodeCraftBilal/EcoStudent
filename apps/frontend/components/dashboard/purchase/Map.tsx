"use client";
import React, { useEffect, useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import { Home } from "lucide-react";
import { GeoLocation, getUserLocation } from "@/lib/location";

const MapCN = () => {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(
    null,
  );
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (e: any) => {
      console.log("Clicked at : ", e);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [isLoaded]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const currentLocation = await getUserLocation();
      setCurrentLocation(currentLocation);
    };

    getCurrentLocation();
  }, [isLoaded]);

  return (
    <div>
      {currentLocation && (
        <div>
          <MapMarker
            key={1}
            latitude={currentLocation?.latitude}
            longitude={currentLocation.longitude}
          >
            <MarkerContent>
              <div className="w-6 h-6 text-blue-400 bg-eco-100 rounded-full flex items-center justify-center">
                <Home className="p-1" />
              </div>
            </MarkerContent>
            <MarkerTooltip>Current Location</MarkerTooltip>
            <MarkerPopup>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Rokhri</p>
                <p className="text-xs text-muted-foreground">
                  {currentLocation.latitude.toFixed(4)},{" "}
                  {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
          <MapControls
            position="bottom-right"
            showFullscreen
            showCompass
            showLocate={true}
          ></MapControls>
        </div>
      )}
    </div>
  );
};

export default function Page({isOpen}: {isOpen: Boolean}) {
  return (
    <Map>
      <MapCN />
    </Map>
  );
}
