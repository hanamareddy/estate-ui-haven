
import { useState } from 'react';
import { toast } from 'sonner';
import PropertyImage from './property/PropertyImage';
import PropertyDetails from './property/PropertyDetails';
import PropertyActions from './property/PropertyActions';
import PropertyDetailDialog from './property/PropertyDetailDialog';
import PropertyContactDialog from './property/PropertyContactDialog';

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
  };
  isCompared?: boolean;
  onCompare?: () => void;
  isFeatured?: boolean;
}

const PropertyCard = ({
  propertyData,
  onCompare,
  isCompared = false,
  isFeatured = false
}: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Map the property type and status to the expected formats
  const mappedType = (propertyData.type?.toLowerCase() === 'apartment' || propertyData.type?.toLowerCase() === 'house' || propertyData.type?.toLowerCase() === 'land') 
    ? (propertyData.type.toLowerCase() as 'apartment' | 'house' | 'land') 
    : 'house';
  
  const mappedStatus = propertyData.status?.toLowerCase().includes('sale') 
    ? 'for-sale' 
    : 'for-rent';

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    toast(isFavorited ? 'Removed from favorites' : 'Added to favorites', {
      icon: isFavorited ? '🗑️' : '❤️',
    });
  };

  const handleInterestClick = () => {
    setIsDialogOpen(true);
  };

  const handleInterestSuccess = () => {
    toast.success('Interest sent to seller!', {
      description: 'The property owner will contact you soon.',
    });
  };

  const handleViewDetails = () => {
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="property-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
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
          />
        </div>
      </div>

      <PropertyContactDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={propertyData.title}
        propertyId={propertyData._id}
        onSuccess={handleInterestSuccess}
      />

      <PropertyDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        title={propertyData.title}
        address={propertyData.address}
        price={propertyData.price}
        bedrooms={propertyData.bedrooms}
        bathrooms={propertyData.bathrooms}
        area={propertyData.sqft}
        imageUrl={propertyData.images?.[0]?.url || '/placeholder.svg'}
        type={mappedType}
        status={mappedStatus}
        onInterestClick={handleInterestClick}
      />
    </>
  );
};

export default PropertyCard;
