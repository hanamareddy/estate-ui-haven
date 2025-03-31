
import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceFilterProps {
  priceRange: { min: string; max: string };
  handlePriceChange: (type: 'min' | 'max', value: string) => void;
}

export const PriceFilter = ({ priceRange, handlePriceChange }: PriceFilterProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <DollarSign className="w-4 h-4 mr-1.5 text-accent" />
        Price Range
      </label>
      <div className="flex space-x-2">
        <input 
          type="number" 
          placeholder="Min" 
          value={priceRange.min}
          onChange={(e) => handlePriceChange('min', e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent/20" 
        />
        <input 
          type="number" 
          placeholder="Max" 
          value={priceRange.max}
          onChange={(e) => handlePriceChange('max', e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-accent/20" 
        />
      </div>
    </div>
  );
};
