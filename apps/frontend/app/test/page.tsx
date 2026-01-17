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
import { mockMessages } from "@/data/dashboard/messages";

const page = () => {
  return (
    <div className="w-96 h-96">
      <div className=" h-56 overflow-y-auto flex flex-col-reverse red">
        {
          mockMessages.map((e, index) =>  (
            <div>
              <div>
                saparator
              </div>
              <div>
              {e.id.toString()}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default page;
