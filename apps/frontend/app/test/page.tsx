"use client";
import { Button } from "@/components/ui/button";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/components/ui/map";
import { useSocket } from "@/context/useSocket";
import React, { useEffect, useState } from "react";

const page = () => {
  return (
    <div className="w-96 h-96">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </div>
  );
};

export default page;
