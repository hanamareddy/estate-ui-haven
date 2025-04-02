
import { useState, useEffect } from 'react';
import { SlidersHorizontal, Filter } from 'lucide-react';
import ActionButton from './ActionButton';
import { StatusFilter } from './filters/StatusFilter';
import { TypeFilter } from './filters/TypeFilter';
import { SortOptions } from './filters/SortOptions';
import { FilterSidebar } from './filters/FilterSidebar';
import { Button } from './ui/button';

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  activeStatus: string;
  activeType: string;
}

const FilterBar = ({ 
  onStatusChange, 
  onTypeChange, 
  activeStatus, 
  activeType 
}: FilterBarProps) => {
  // State for the filter sidebar
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [areaRange, setAreaRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterSidebar = document.getElementById('filter-sidebar');
      if (filterSidebar && !filterSidebar.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange({ ...priceRange, [type]: value });
  };

  const handleAreaChange = (type: 'min' | 'max', value: string) => {
    setAreaRange({ ...areaRange, [type]: value });
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setAreaRange({ min: '', max: '' });
    setBedrooms('any');
    setBathrooms('any');
    setSelectedAmenities([]);
    onStatusChange('all');
    onTypeChange('all');
    setSortOrder('newest');
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
    setIsSortOpen(false);
  };

  // Calculate number of active filters
  const activeFiltersCount = (() => {
    let count = 0;
    if (activeStatus !== 'all') count++;
    if (activeType !== 'all') count++;
    if (priceRange.min || priceRange.max) count++;
    if (bedrooms !== 'any') count++;
    if (bathrooms !== 'any') count++;
    if (areaRange.min || areaRange.max) count++;
    if (selectedAmenities.length > 0) count++;
    if (sortOrder !== 'newest') count++;
    return count;
  })();

  return (
    <>
      {/* Main filter button bar - always visible */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-4 md:p-5 sticky top-20 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-medium">Properties</h3>
            <span className="bg-secondary/80 px-2 py-0.5 rounded-full text-xs font-medium">
              {activeFiltersCount > 0 ? `${activeFiltersCount} filters applied` : 'No filters'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={isFilterOpen ? "bg-accent text-white" : ""}
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                if (!isFilterOpen) setIsSortOpen(false);
              }}
            >
              <Filter className="w-4 h-4 mr-1.5" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter sidebar */}
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
      />
    </>
  );
};

export default FilterBar;
