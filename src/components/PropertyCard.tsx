
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import PropertyImage from './property/PropertyImage';
import PropertyDetails from './property/PropertyDetails';
import PropertyActions from './property/PropertyActions';

interface PropertyCardProps {
  propertyData: {
    _id: string;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: { url: string }[];
    type: string;
    status: string;
    priority?: 'high' | 'medium' | 'low';
    seller?: {
      name?: string;
      phone?: string;
      email?: string;
    };
    amenities?: string[];
    builtYear?: number;
    description?: string;
    location?: {
      latitude?: number;
      longitude?: number;
    };
    furnishing?: string;
    parking?: number;
    facingDirection?: string;
    constructionStatus?: string;
  };
  isCompared?: boolean;
  onCompare?: () => void;
  isFeatured?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const PropertyCard = ({
  propertyData,
  onCompare,
  isCompared = false,
  isFeatured = false,
  onClose,
  showCloseButton = false
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const mappedType = (propertyData.type?.toLowerCase() === 'apartment' || propertyData.type?.toLowerCase() === 'house' || propertyData.type?.toLowerCase() === 'land') 
    ? (propertyData.type.toLowerCase() as 'apartment' | 'house' | 'land') 
    : 'house';
  
  const mappedStatus = propertyData.status?.toLowerCase().includes('sale') 
    ? 'for-sale' 
    : 'for-rent';

  const priority = propertyData.priority || 'medium';

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorited 
        ? 'This property has been removed from your favorites.' 
        : 'This property has been added to your favorites.',
      variant: isFavorited ? 'destructive' : 'default',
      duration: priority === 'high' ? 5000 : (priority === 'medium' ? 4000 : 3000),
    });
  };

  const handleInterestClick = () => {
    navigate(`/property/${propertyData._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/property/${propertyData._id}`);
  };

  return (
    <div className="property-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
      {priority === 'high' && (
        <div className="bg-accent text-white text-xs px-2 py-1 text-center">
          High Demand Property
        </div>
      )}
      
      <PropertyImage 
        imageUrl={propertyData.images?.[0]?.url || '/placeholder.svg'} 
        title={propertyData.title}
        status={mappedStatus}
        type={mappedType}
        isFavorited={isFavorited}
        isCompared={isCompared}
        onFavoriteClick={handleFavoriteClick}
        isImageLoaded={isImageLoaded}
        onImageLoad={() => setIsImageLoaded(true)}
      />
      
      <PropertyDetails 
        title={propertyData.title}
        address={propertyData.address}
        price={propertyData.price}
        type={mappedType}
        status={mappedStatus}
        bedrooms={propertyData.bedrooms}
        bathrooms={propertyData.bathrooms}
        area={propertyData.sqft}
      />
      
      <div className="px-4 pb-4">
        <PropertyActions 
          onInterestClick={handleInterestClick}
          onViewDetails={handleViewDetails}
          onCompare={onCompare}
          isCompared={isCompared}
          onClose={onClose}
          showCloseButton={showCloseButton}
        />
      </div>
    </div>
  );
};

export default PropertyCard;
