
import React from 'react';
import { X } from 'lucide-react';
import { PriceFilter } from './PriceFilter';
import { BedroomsFilter } from './BedroomsFilter';
import { BathroomsFilter } from './BathroomsFilter';
import { PropertySizeFilter } from './PropertySizeFilter';
import { YearBuiltFilter } from './YearBuiltFilter';
import { LocationFilter } from './LocationFilter';
import { PropertyIdFilter } from './PropertyIdFilter';
import { PropertyStatusFilter } from './PropertyStatusFilter';
import { AmenitiesFilter } from './AmenitiesFilter';
import { StatusFilter } from './StatusFilter';
import { TypeFilter } from './TypeFilter';
import { SortOptions } from './SortOptions';
import { useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  priceRange: { min: string; max: string };
  handlePriceChange: (type: 'min' | 'max', value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  areaRange: { min: string; max: string };
  handleAreaChange: (type: 'min' | 'max', value: string) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  resetFilters: () => void;
  closeFilters: () => void;
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
  closeFilters
}: FilterSidebarProps) => {
  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
          <StatusFilter activeStatus="all" onStatusChange={() => {}} />
          <div className="my-4 border-t border-border"></div>
          
          <TypeFilter activeType="all" onTypeChange={() => {}} />
          <div className="my-4 border-t border-border"></div>
          
          <PriceFilter priceRange={priceRange} handlePriceChange={handlePriceChange} />
          <BedroomsFilter bedrooms={bedrooms} setBedrooms={setBedrooms} />
          <BathroomsFilter bathrooms={bathrooms} setBathrooms={setBathrooms} />
          <PropertySizeFilter areaRange={areaRange} handleAreaChange={handleAreaChange} />
          <YearBuiltFilter />
          <LocationFilter />
          <PropertyIdFilter />
          <PropertyStatusFilter />
          <AmenitiesFilter selectedAmenities={selectedAmenities} toggleAmenity={toggleAmenity} />
        </div>

        <div className="flex flex-wrap justify-between mt-8 gap-3 sticky bottom-0 bg-white pb-2 pt-4 border-t border-border">
          <button 
            onClick={resetFilters}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary/50"
          >
            Reset All
          </button>
          <SheetClose asChild>
            <button 
              onClick={closeFilters}
              className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90"
            >
              Apply Filters
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
