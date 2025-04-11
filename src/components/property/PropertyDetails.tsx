import React from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface PropertyDetailsProps {
  title: string;
  address: string;
  price: number;
  type: 'house' | 'apartment' | 'land';
  status: 'for-sale' | 'for-rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
}

const PropertyDetails = ({
  title,
  address,
  price,
  type,
  status,
  bedrooms,
  bathrooms,
  area
}: PropertyDetailsProps) => {
  // Format price in Indian Rupee format
  const formatPrice = (value: number) => {
    // Convert to Indian numbering system (lakhs and crores)
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lac`;
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm line-clamp-1">{address}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{formatPrice(price)}</div>
          <div className="text-xs text-muted-foreground">
            {status === 'for-rent' ? '/month' : ''}
          </div>
        </div>
      </div>
      
      {/* Property details */}
      {type !== 'land' && (
        <div className="flex items-center justify-between mt-4 py-3 border-t border-border">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="text-sm">{bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="text-sm">{bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="text-sm">{area} ft²</span>
          </div>
        </div>
      )}
      
      {type === 'land' && (
        <div className="flex items-center mt-4 py-3 border-t border-border">
          <Square className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <span className="text-sm">{area} ft²</span>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
