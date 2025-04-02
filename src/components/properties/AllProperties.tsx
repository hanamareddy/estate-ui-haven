
import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

interface AllPropertiesProps {
  properties: any[];
  compareProperties: any[];
  toggleCompare: (property: any) => void;
  resetFilters: () => void;
  isLoading?: boolean;
  error?: any;
}

const AllProperties: React.FC<AllPropertiesProps> = ({
  properties,
  compareProperties,
  toggleCompare,
  resetFilters,
  isLoading = false,
  error = null
}) => {
  // Filter out featured properties that are already shown
  const remainingProperties = properties || [];

  if (isLoading) {
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6">All Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border rounded-lg bg-white">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6">All Properties</h3>
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-500 mb-2">Failed to load properties</p>
          <p className="text-sm mb-4">{error.message || 'An unknown error occurred'}</p>
          <Button onClick={resetFilters} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  if (remainingProperties.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6">All Properties</h3>
        <div className="text-center p-8 bg-secondary rounded-lg">
          <p className="text-muted-foreground mb-4">No properties found matching your criteria</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">All Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {remainingProperties.map((property) => (
          <PropertyCard
            key={property._id}
            propertyData={property}
            isCompared={compareProperties.some(p => p._id === property._id)}
            onCompare={() => toggleCompare(property)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
