
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationFilterProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export const LocationFilter = ({ location, onLocationChange }: LocationFilterProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="location-filter" className="text-sm font-medium flex items-center mb-3">
        <span className="text-accent mr-1.5">✦</span>
        Location
      </label>
      <div className="relative">
        <Input
          id="location-filter"
          type="text"
          placeholder="Search by city, area, etc."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="pl-9"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default LocationFilter;
