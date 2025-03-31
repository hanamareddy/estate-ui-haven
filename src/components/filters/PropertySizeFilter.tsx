
import React from 'react';
import { Ruler } from 'lucide-react';

interface PropertySizeFilterProps {
  areaRange: { min: string; max: string };
  handleAreaChange: (type: 'min' | 'max', value: string) => void;
}

export const PropertySizeFilter = ({ areaRange, handleAreaChange }: PropertySizeFilterProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <Ruler className="w-4 h-4 mr-1.5 text-accent" />
        Property Size (sqft)
      </label>
      <div className="flex space-x-2">
        <input 
          type="number" 
          placeholder="Min" 
          value={areaRange.min}
          onChange={(e) => handleAreaChange('min', e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent/20" 
        />
        <input 
          type="number" 
          placeholder="Max" 
          value={areaRange.max}
          onChange={(e) => handleAreaChange('max', e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent/20" 
        />
      </div>
    </div>
  );
};
