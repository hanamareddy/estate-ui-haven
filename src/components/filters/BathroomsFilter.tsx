
import React from 'react';
import { Bath } from 'lucide-react';
import ActionButton from '../ActionButton';

interface BathroomsFilterProps {
  bathrooms: string;
  setBathrooms: (value: string) => void;
}

export const BathroomsFilter = ({ bathrooms, setBathrooms }: BathroomsFilterProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <Bath className="w-4 h-4 mr-1.5 text-accent" />
        Bathrooms
      </label>
      <div className="flex flex-wrap gap-2">
        <ActionButton 
          size="sm" 
          active={bathrooms === 'any'} 
          activeColor="bg-accent text-white"
          onClick={() => setBathrooms('any')}
        >Any</ActionButton>
        <ActionButton 
          size="sm" 
          active={bathrooms === '1'} 
          activeColor="bg-accent text-white"
          onClick={() => setBathrooms('1')}
        >1+</ActionButton>
        <ActionButton 
          size="sm" 
          active={bathrooms === '2'} 
          activeColor="bg-accent text-white"
          onClick={() => setBathrooms('2')}
        >2+</ActionButton>
        <ActionButton 
          size="sm" 
          active={bathrooms === '3'} 
          activeColor="bg-accent text-white"
          onClick={() => setBathrooms('3')}
        >3+</ActionButton>
      </div>
    </div>
  );
};
