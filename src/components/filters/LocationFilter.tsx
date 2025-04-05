
import React from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LocationFilter = () => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <MapPin className="w-4 h-4 mr-1.5 text-accent" />
        Location
      </label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="downtown">Downtown</SelectItem>
          <SelectItem value="suburbs">Suburbs</SelectItem>
          <SelectItem value="beachfront">Beachfront</SelectItem>
          <SelectItem value="rural">Rural</SelectItem>
          <SelectItem value="mountain">Mountain</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
