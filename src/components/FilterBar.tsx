
import React from 'react';
import { StatusFilter } from './filters/StatusFilter';
import { TypeFilter } from './filters/TypeFilter';
import { SortOptions } from './filters/SortOptions';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import { LocationFilter } from './filters/LocationFilter';

export interface FilterBarProps {
  activeStatus: string;
  activeType: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
}

const FilterBar = ({ 
  activeStatus, 
  activeType, 
  onStatusChange, 
  onTypeChange,
  location = '',
  onLocationChange = () => {}
}: FilterBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow">
            <StatusFilter activeStatus={activeStatus} onStatusChange={onStatusChange} />
            <div className="hidden md:flex">
              <TypeFilter activeType={activeType} onTypeChange={onTypeChange} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SortOptions />
            <Button variant="outline" size="sm" className="md:hidden">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="md:flex items-center gap-4">
          <div className="w-full md:w-1/3">
            <LocationFilter 
              location={location}
              onLocationChange={onLocationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
