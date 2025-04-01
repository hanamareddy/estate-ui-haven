
import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Calculate total pages
  const totalPages = Math.ceil((properties?.length || 0) / itemsPerPage);
  
  // Get current page items
  const currentItems = properties
    ? properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById('all-properties')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };
  
  if (isLoading) {
    return (
      <div id="all-properties">
        <h2 className="text-2xl font-bold mb-6">All Properties</h2>
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
      <div id="all-properties">
        <h2 className="text-2xl font-bold mb-6">All Properties</h2>
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-500 mb-2">Failed to load properties</p>
          <p className="text-sm">{error.message || 'An unknown error occurred'}</p>
          <Button onClick={resetFilters} className="mt-4">Reset Filters</Button>
        </div>
      </div>
    );
  }
  
  if (properties?.length === 0) {
    return (
      <div id="all-properties">
        <h2 className="text-2xl font-bold mb-6">All Properties</h2>
        <div className="text-center p-8 bg-secondary rounded-lg">
          <p className="text-muted-foreground mb-4">No properties found with the current filters</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      </div>
    );
  }

  return (
    <div id="all-properties">
      <h2 className="text-2xl font-bold mb-6">All Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            isCompared={compareProperties.some(p => p._id === property._id)}
            onCompare={() => toggleCompare(property)}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
