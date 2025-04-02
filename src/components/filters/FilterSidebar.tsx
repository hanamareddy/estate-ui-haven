
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceFilter } from './PriceFilter';
import { BedroomsFilter } from './BedroomsFilter';
import { BathroomsFilter } from './BathroomsFilter';
import { PropertySizeFilter } from './PropertySizeFilter';
import { AmenitiesFilter } from './AmenitiesFilter';
import { StatusFilter } from './StatusFilter';
import { TypeFilter } from './TypeFilter';
import { LocationFilter } from './LocationFilter';

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  priceRange: { min: string; max: string };
  handlePriceChange: (type: 'min' | 'max', value: string) => void;
  bedrooms: string;
  setBedrooms: React.Dispatch<React.SetStateAction<string>>;
  bathrooms: string;
  setBathrooms: React.Dispatch<React.SetStateAction<string>>;
  areaRange: { min: string; max: string };
  handleAreaChange: (type: 'min' | 'max', value: string) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  resetFilters: () => void;
  closeFilters: () => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  activeStatus?: string;
  activeType?: string;
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
}

export const FilterSidebar = ({
  isFilterOpen,
  setIsFilterOpen,
  priceRange,
  handlePriceChange,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  areaRange,
  handleAreaChange,
  selectedAmenities,
  toggleAmenity,
  resetFilters,
  closeFilters,
  location = '',
  onLocationChange = () => {},
  activeStatus = 'all',
  activeType = 'all',
  onStatusChange = () => {},
  onTypeChange = () => {}
}: FilterSidebarProps) => {
  if (!isFilterOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/40" 
      onClick={closeFilters}
    >
      <div 
        id="filter-sidebar"
        className="absolute top-0 right-0 h-full w-full max-w-md bg-background z-50 overflow-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <LocationFilter
            location={location}
            onLocationChange={onLocationChange}
          />
          
          <StatusFilter
            activeStatus={activeStatus}
            onStatusChange={onStatusChange}
          />

          <TypeFilter
            activeType={activeType}
            onTypeChange={onTypeChange}
          />

          <PriceFilter 
            priceRange={priceRange} 
            handlePriceChange={handlePriceChange} 
          />
          
          <BedroomsFilter 
            bedrooms={bedrooms} 
            setBedrooms={setBedrooms} 
          />
          
          <BathroomsFilter 
            bathrooms={bathrooms} 
            setBathrooms={setBathrooms} 
          />
          
          <PropertySizeFilter 
            areaRange={areaRange} 
            handleAreaChange={handleAreaChange} 
          />
          
          <AmenitiesFilter 
            selectedAmenities={selectedAmenities} 
            toggleAmenity={toggleAmenity} 
          />
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={resetFilters}
          >
            Reset All
          </Button>
          <Button 
            onClick={closeFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
