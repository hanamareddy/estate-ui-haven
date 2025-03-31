
import React from 'react';
import PropertyCard from '../PropertyCard';

interface AllPropertiesProps {
  properties: any[];
  compareProperties: any[];
  toggleCompare: (property: any) => void;
  resetFilters: () => void;
}

const AllProperties = ({ properties, compareProperties, toggleCompare, resetFilters }: AllPropertiesProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6">All Properties</h3>
      
      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-border">
          <p className="text-lg text-muted-foreground">No properties found with the selected filters.</p>
          <button 
            className="mt-4 btn-outline"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={property.address}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              imageUrl={property.imageUrl}
              type={property.type as 'house' | 'apartment' | 'land'}
              status={property.status as 'for-sale' | 'for-rent'}
              onCompare={() => toggleCompare(property)}
              isCompared={compareProperties.some(p => p.id === property.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;
