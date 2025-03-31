
import React from 'react';
import { Home, Building2, Trees } from 'lucide-react';
import ActionButton from '../ActionButton';

interface TypeFilterProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

export const TypeFilter = ({ activeType, onTypeChange }: TypeFilterProps) => {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">Type:</span>
      <ActionButton
        active={activeType === 'all'}
        activeColor="bg-accent text-white"
        onClick={() => onTypeChange('all')}
      >
        All
      </ActionButton>
      <ActionButton
        active={activeType === 'house'}
        activeColor="bg-accent text-white"
        onClick={() => onTypeChange('house')}
        icon={<Home className="w-4 h-4 mr-1.5" />}
      >
        Houses
      </ActionButton>
      <ActionButton
        active={activeType === 'apartment'}
        activeColor="bg-accent text-white"
        onClick={() => onTypeChange('apartment')}
        icon={<Building2 className="w-4 h-4 mr-1.5" />}
      >
        Apartments
      </ActionButton>
      <ActionButton
        active={activeType === 'land'}
        activeColor="bg-accent text-white"
        onClick={() => onTypeChange('land')}
        icon={<Trees className="w-4 h-4 mr-1.5" />}
      >
        Land
      </ActionButton>
    </div>
  );
};
