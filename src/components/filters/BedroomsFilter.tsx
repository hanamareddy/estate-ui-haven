
import React from 'react';
import { BedDouble } from 'lucide-react';
import ActionButton from '../ActionButton';

interface BedroomsFilterProps {
  bedrooms: string;
  setBedrooms: (value: string) => void;
}

export const BedroomsFilter = ({ bedrooms, setBedrooms }: BedroomsFilterProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <BedDouble className="w-4 h-4 mr-1.5 text-accent" />
        Bedrooms
      </label>
      <div className="flex flex-wrap gap-2">
        <ActionButton 
          size="sm" 
          active={bedrooms === 'any'} 
          activeColor="bg-accent text-white"
          onClick={() => setBedrooms('any')}
        >Any</ActionButton>
        <ActionButton 
          size="sm" 
          active={bedrooms === '1'} 
          activeColor="bg-accent text-white"
          onClick={() => setBedrooms('1')}
        >1+</ActionButton>
        <ActionButton 
          size="sm" 
          active={bedrooms === '2'} 
          activeColor="bg-accent text-white"
          onClick={() => setBedrooms('2')}
        >2+</ActionButton>
        <ActionButton 
          size="sm" 
          active={bedrooms === '3'} 
          activeColor="bg-accent text-white"
          onClick={() => setBedrooms('3')}
        >3+</ActionButton>
        <ActionButton 
          size="sm" 
          active={bedrooms === '4'} 
          activeColor="bg-accent text-white"
          onClick={() => setBedrooms('4')}
        >4+</ActionButton>
      </div>
    </div>
  );
};
