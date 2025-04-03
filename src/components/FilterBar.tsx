
import React from 'react';
import { Button } from '@/components/ui/button';
import { TypeFilter } from './filters/TypeFilter';
import { StatusFilter } from './filters/StatusFilter';
import { FilterSidebar } from './filters/FilterSidebar';
import { Map, Filter as FilterIcon } from 'lucide-react';
import { LocationFilter } from './filters/LocationFilter';

interface FilterBarProps {
  activeStatus: string;
  activeType: string;
  location?: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onLocationChange?: (location: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeStatus, 
  activeType, 
  location = '',
  onStatusChange, 
  onTypeChange,
  onLocationChange = () => {}
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [areaRange, setAreaRange] = React.useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prevState => ({
      ...prevState,
      [type]: value
    }));
  };

  const handleAreaChange = (type: 'min' | 'max', value: string) => {
    setAreaRange(prevState => ({
      ...prevState,
      [type]: value
    }));
  };
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prevState => 
      prevState.includes(amenity)
        ? prevState.filter(item => item !== amenity)
        : [...prevState, amenity]
    );
  };
  
  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setBedrooms('');
    setBathrooms('');
    setAreaRange({ min: '', max: '' });
    setSelectedAmenities([]);
    onStatusChange('all');
    onTypeChange('all');
    onLocationChange('');
  };
  
  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="mb-8">
      <div className="bg-background rounded-md border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="hidden md:flex flex-wrap gap-4">
              <StatusFilter 
                activeStatus={activeStatus} 
                onStatusChange={onStatusChange} 
              />
              <TypeFilter 
                activeType={activeType} 
                onTypeChange={onTypeChange} 
              />
            </div>
            <div className="md:hidden">
              <LocationFilter
                location={location}
                onLocationChange={onLocationChange}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={() => setIsFilterOpen(true)}
            >
              <FilterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map View</span>
            </Button>
          </div>
        </div>
      </div>
      
      <FilterSidebar 
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        bathrooms={bathrooms}
        setBathrooms={setBathrooms}
        areaRange={areaRange}
        handleAreaChange={handleAreaChange}
        selectedAmenities={selectedAmenities}
        toggleAmenity={toggleAmenity}
        resetFilters={resetFilters}
        closeFilters={closeFilters}
        location={location}
        onLocationChange={onLocationChange}
        activeStatus={activeStatus}
        activeType={activeType}
        onStatusChange={onStatusChange}
        onTypeChange={onTypeChange}
      />
    </div>
  );
};

export default FilterBar;
