
import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  activeStatus: string;
  activeType: string;
  location: string;
  onLocationChange: (value: string) => void;
}

const FilterBar = ({ 
  onStatusChange, 
  onTypeChange, 
  activeStatus, 
  activeType,
  location,
  onLocationChange 
}: FilterBarProps) => {
  // Define status and type options
  const statusOptions = [
    { id: 'all', label: 'All' },
    { id: 'sale', label: 'For Sale' },
    { id: 'rent', label: 'For Rent' },
  ];
  
  const typeOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'house', label: 'House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'villa', label: 'Villa' },
    { id: 'plot', label: 'Plot' },
    { id: 'commercial', label: 'Commercial' },
  ];
  
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange(e.target.value);
  };

  const clearLocation = () => {
    onLocationChange('');
  };

  return (
    <div className="relative z-10 mb-8 bg-background border border-input rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row p-4 gap-4">
        {/* Location Search */}
        <div className="flex-grow relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search location..."
              className="pl-10 pr-10 py-2 w-full border-input border rounded-md"
              value={location}
              onChange={handleLocationInputChange}
            />
            {location && (
              <button
                onClick={clearLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium mr-2">Status:</span>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeStatus === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => onStatusChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium mr-2">Type:</span>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeType === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => onTypeChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
