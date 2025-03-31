
import React from 'react';
import PropertyCard from '../PropertyCard';

interface FeaturedPropertiesProps {
  properties: any[];
  compareProperties: any[];
  toggleCompare: (property: any) => void;
}

const FeaturedProperties = ({ properties, compareProperties, toggleCompare }: FeaturedPropertiesProps) => {
  const featuredProperties = properties.filter(property => property.featured);

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="bg-accent/20 text-accent px-2 py-1 rounded-md text-sm mr-2">Featured</span>
        Featured Properties
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProperties.map((property) => (
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
    </div>
  );
};

export default FeaturedProperties;
