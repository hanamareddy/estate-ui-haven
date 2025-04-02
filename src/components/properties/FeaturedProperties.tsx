
import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedPropertiesProps {
  properties: any[];
  compareProperties: any[];
  toggleCompare: (property: any) => void;
  isLoading?: boolean;
  error?: any;
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ 
  properties, 
  compareProperties, 
  toggleCompare,
  isLoading = false,
  error = null 
}) => {
  // Filter featured properties (highest priced or newest)
  const featuredProperties = properties
    ?.sort((a, b) => b.price - a.price)
    .slice(0, 3) || [];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
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
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg mb-12">
        <p className="text-red-500 mb-2">Failed to load featured properties</p>
        <p className="text-sm">{error.message || 'An unknown error occurred'}</p>
      </div>
    );
  }
  
  if (featuredProperties.length === 0) {
    return (
      <div className="text-center p-8 bg-secondary rounded-lg mb-12">
        <p className="text-muted-foreground">No featured properties available at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {featuredProperties.map((property) => (
        <PropertyCard
          key={property._id} 
          propertyData={property}
          isCompared={compareProperties.some(p => p._id === property._id)}
          onCompare={() => toggleCompare(property)}
          isFeatured={true}
        />
      ))}
    </div>
  );
};

export default FeaturedProperties;
