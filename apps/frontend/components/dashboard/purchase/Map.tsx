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
import { Home, LocationEditIcon, MapPin } from "lucide-react";
import { GeoLocation, getUserLocation } from "@/lib/location";
import { Coords } from "./LocationMap";

interface MapCNProps {
  selectedCoords: Coords;
  setSelectedCoords: (coords: Coords) => void;
}

const styles = {
  default: undefined,
  positron: "https://tiles.openfreemap.org/styles/positron",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

const mapStyle = {light: styles.openstreetmap}

const MapCN = ({ selectedCoords ,setSelectedCoords }: MapCNProps) => {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(
    null,
  );
  const { map, isLoaded } = useMap();

  // ---------for 3d map ------------------
  // useEffect(() => {
    // if (!map || !isLoaded) return;
    // map.easeTo({ pitch: 60, duration: 500 });
  // }, [map, isLoaded]);

  // markder
  const [markders, setMarkders] = useState([]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (e: any) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoords({ lat, lng });
      console.log("Clicked at : ", e);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [isLoaded, map]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const currentLocation = await getUserLocation();
      setCurrentLocation(currentLocation);
    };

    getCurrentLocation();
  }, [map, isLoaded]);

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
              <div className="w-10 h-10 text-blue-400 bg-eco-blue-400/0 rounded-full flex items-center justify-center">
                <Home className="w-12 h-12 text-green-900 p-1" />
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
          
          {selectedCoords && <MapMarker
            key={2}
            latitude={selectedCoords.lat}
            longitude={selectedCoords.lng}
          >
            <MarkerContent>
              <div className="w-10 h-10 text-blue-400 bg-eco-400/0 rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-red-500 p-1 font-bold" />
              </div>
            </MarkerContent>
            <MarkerTooltip>Meetup Location</MarkerTooltip>
            <MarkerPopup>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Rokhri</p>
                <p className="text-xs text-muted-foreground">
                  {currentLocation.latitude.toFixed(4)},{" "}
                  {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>}

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

export default function Page({
  selectedCoords,
  setSelectedCoords,
}: MapCNProps) {
  return (
    <Map
      center={[selectedCoords.lat, selectedCoords.lng]}
      zoom={2}
      styles={mapStyle}
    >
      <MapCN
        selectedCoords={selectedCoords}
        setSelectedCoords={setSelectedCoords}
      />
    </Map>
  );
}
