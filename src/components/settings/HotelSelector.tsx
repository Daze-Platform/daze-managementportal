import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  location: string;
}

const hotels: Hotel[] = [
  {
    id: "oceanview-grand",
    name: "Oceanview Grand Resort",
    location: "Pensacola Beach, Florida",
  },
  {
    id: "emerald-coast-inn",
    name: "Emerald Coast Inn & Suites",
    location: "Destin, Florida",
  },
  {
    id: "gulf-shores-resort",
    name: "Gulf Shores Beach Resort",
    location: "Gulf Shores, Alabama",
  },
  {
    id: "panama-city-plaza",
    name: "Panama City Beach Plaza",
    location: "Panama City Beach, Florida",
  },
  {
    id: "mobile-bay-hotel",
    name: "Mobile Bay Waterfront Hotel",
    location: "Mobile, Alabama",
  },
  {
    id: "fort-walton-beach",
    name: "Fort Walton Beach Resort",
    location: "Fort Walton Beach, Florida",
  },
];

export const HotelSelector = () => {
  const [selectedHotel, setSelectedHotel] = useState("oceanview-grand");

  const handleHotelChange = (hotelId: string) => {
    setSelectedHotel(hotelId);
    console.log("Hotel changed to:", hotelId);
    // Here you would typically update the global state or make an API call
  };

  const currentHotel = hotels.find((hotel) => hotel.id === selectedHotel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Hotel Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="hotel-select">Current Hotel</Label>
          <Select value={selectedHotel} onValueChange={handleHotelChange}>
            <SelectTrigger id="hotel-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{hotel.name}</span>
                    <span className="text-sm text-gray-500">
                      {hotel.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentHotel && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">{currentHotel.name}</h4>
            <p className="text-sm text-blue-700">{currentHotel.location}</p>
            <p className="text-xs text-blue-600 mt-2">
              All settings and data will be specific to this hotel location.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
