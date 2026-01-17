"use client";

import { useEffect, useRef } from "react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import GoogleMap from "@/components/maps/GoogleMap";

const page = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
  }, [])
  
  return (
    <div className="w-96 h-96">
      <GoogleMap 
        isOpen={true}
        latitude={32.4799}
        longitude={74.34}
        locationName="rokhri"
        address="rokhri more"
        selectable={true}
        onClose={() => {console.log('close')}}
        onLocationSelect={() => console.log('location ')}
      />
    </div>
  );
};

export default page;
