import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';

interface LocationFilterProps {
  onChange?: (location: string) => void;
  value?: string;
}

export const LocationFilter = ({ onChange, value = '' }: LocationFilterProps) => {
  const [locations, setLocations] = useState<string[]>([
    'All Locations', 'Downtown', 'Suburbs', 'Beachfront', 'Rural', 'Mountain'
  ]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_BASE_URL}/properties/locations`);
        
        if (response.data && response.data.length > 0) {
          // Add "All Locations" option if it doesn't exist
          if (!response.data.includes('All Locations')) {
            setLocations(['All Locations', ...response.data]);
          } else {
            setLocations(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Keep default locations if fetch fails
      }
    };
    
    fetchLocations();
  }, []);

  const handleLocationChange = (location: string) => {
    if (onChange) {
      onChange(location === 'all' ? '' : location);
    }
  };

  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <MapPin className="w-4 h-4 mr-1.5 text-accent" />
        Location
      </label>
      <Select value={value || 'all'} onValueChange={handleLocationChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((location) => (
            location !== 'All Locations' && (
              <SelectItem key={location.toLowerCase().replace(/\s+/g, '-')} value={location.toLowerCase().replace(/\s+/g, '-')}>
                {location}
              </SelectItem>
            )
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilter;
