
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SellerPropertyCard from '@/components/SellerPropertyCard';

interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  images?: string[];
  status: string;
  interestedUsers?: number;
  viewCount?: number;
  favoriteCount?: number;
  createdAt?: string;
}

interface PropertiesTabContentProps {
  isLoading: boolean;
  error: any;
  filteredProperties: Property[];
  viewMode: string;
  handleToggleStatus: (propertyId: string) => void;
  handleEditProperty: (propertyId: string) => void;
  handleDeleteProperty: (propertyId: string) => void;
  refetch: () => void;
  searchQuery: string;
  activeFilter: string;
}

const PropertiesTabContent = ({
  isLoading,
  error,
  filteredProperties,
  viewMode,
  handleToggleStatus,
  handleEditProperty,
  handleDeleteProperty,
  refetch,
  searchQuery,
  activeFilter
}: PropertiesTabContentProps) => {
  if (isLoading) {
    return (
      <div className="text-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500 mb-4">Failed to load properties</p>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="text-center p-12 bg-secondary/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery || activeFilter !== 'all'
            ? "No properties match your search criteria. Try adjusting your filters."
            : "You haven't added any properties yet."}
        </p>
        <Link to="/seller/property/add">
          <Button>Add Your First Property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }
    >
      {filteredProperties.map((property) => (
        <SellerPropertyCard
          key={property._id}
          property={{
            id: property._id,
            title: property.title,
            address: property.address,
            price: property.price,
            type: property.type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft || 0,
            images: property.images || ['https://via.placeholder.com/400x300?text=No+Image'],
            status: property.status,
            interestedUsers: property.interestedUsers || 0,
            viewCount: property.viewCount || 0,
            favoriteCount: property.favoriteCount || 0,
            created: property.createdAt || new Date().toISOString()
          }}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      ))}
    </div>
  );
};

export default PropertiesTabContent;
