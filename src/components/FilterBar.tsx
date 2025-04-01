
import React, { useState } from 'react';
import { Filter, Search, Sliders } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import StatusFilter from './filters/StatusFilter';
import TypeFilter from './filters/TypeFilter';
import SortOptions from './filters/SortOptions';
import { FilterSidebar } from './filters/FilterSidebar';

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
  onSortChange?: (sort: string) => void;
}

const FilterBar = ({
  onSearch = () => {},
  onStatusChange = () => {},
  onTypeChange = () => {},
  onSortChange = () => {},
}: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeSort, setActiveSort] = useState('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Additional filter state
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaRange, setAreaRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    onStatusChange(status);
  };
  
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    onTypeChange(type);
  };
  
  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    onSortChange(sort);
  };
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };
  
  const handleAreaChange = (type: 'min' | 'max', value: string) => {
    setAreaRange(prev => ({ ...prev, [type]: value }));
  };
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const resetFilters = () => {
    setActiveStatus('all');
    setActiveType('all');
    setActiveSort('recommended');
    setPriceRange({ min: '', max: '' });
    setBedrooms('');
    setBathrooms('');
    setAreaRange({ min: '', max: '' });
    setSelectedAmenities([]);
    
    onStatusChange('all');
    onTypeChange('all');
    onSortChange('recommended');
  };
  
  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search by location, property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">More Filters</span>
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>
        
        <StatusFilter active={activeStatus} onChange={handleStatusChange} />
        <TypeFilter active={activeType} onChange={handleTypeChange} />
        <div className="ml-auto">
          <SortOptions active={activeSort} onChange={handleSortChange} />
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
        activeStatus={activeStatus}
        activeType={activeType}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
      />
    </div>
  );
};

export default FilterBar;
