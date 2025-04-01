
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import PriceFilter from '@/components/filters/PriceFilter';
import BedroomsFilter from '@/components/filters/BedroomsFilter';
import BathroomsFilter from '@/components/filters/BathroomsFilter';
import PropertySizeFilter from '@/components/filters/PropertySizeFilter';
import AmenitiesFilter from '@/components/filters/AmenitiesFilter';
import PropertyStatusFilter from '@/components/filters/PropertyStatusFilter';
import PropertyTypeFilter from '@/components/filters/TypeFilter';

export interface FilterSidebarProps {
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
  activeStatus: string;
  activeType: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
  activeStatus,
  activeType,
  onStatusChange,
  onTypeChange
}) => {
  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <PropertyStatusFilter activeStatus={activeStatus} onStatusChange={onStatusChange} />
          
          <PropertyTypeFilter activeType={activeType} onTypeChange={onTypeChange} />
          
          <PriceFilter 
            min={priceRange.min} 
            max={priceRange.max} 
            onChange={handlePriceChange} 
          />
          
          <BedroomsFilter value={bedrooms} onChange={setBedrooms} />
          
          <BathroomsFilter value={bathrooms} onChange={setBathrooms} />
          
          <PropertySizeFilter 
            min={areaRange.min} 
            max={areaRange.max} 
            onChange={handleAreaChange} 
          />
          
          <AmenitiesFilter 
            selectedAmenities={selectedAmenities}
            toggleAmenity={toggleAmenity}
          />
        </div>

        <SheetFooter className="flex-col sm:flex-col gap-3 mt-6">
          <Button onClick={closeFilters} className="w-full">Apply Filters</Button>
          <Button onClick={resetFilters} variant="outline" className="w-full">Reset All</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
