
import { useState } from 'react';
import { toast } from 'sonner';
import PropertyImage from './property/PropertyImage';
import PropertyDetails from './property/PropertyDetails';
import PropertyActions from './property/PropertyActions';
import PropertyDetailDialog from './property/PropertyDetailDialog';
import PropertyContactDialog from './property/PropertyContactDialog';

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  type: 'house' | 'apartment' | 'land';
  status: 'for-sale' | 'for-rent';
  onCompare?: () => void;
  isCompared?: boolean;
}

const PropertyCard = ({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  type,
  status,
  onCompare,
  isCompared = false
}: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
          imageUrl={imageUrl}
          title={title}
          status={status}
          type={type}
          isFavorited={isFavorited}
          isCompared={isCompared}
          onFavoriteClick={handleFavoriteClick}
          isImageLoaded={isImageLoaded}
          onImageLoad={() => setIsImageLoaded(true)}
        />
        
        <PropertyDetails 
          title={title}
          address={address}
          price={price}
          type={type}
          status={status}
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          area={area}
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
        title={title}
        propertyId={id}
        onSuccess={handleInterestSuccess}
      />

      <PropertyDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        title={title}
        address={address}
        price={price}
        bedrooms={bedrooms}
        bathrooms={bathrooms}
        area={area}
        imageUrl={imageUrl}
        type={type}
        status={status}
        onInterestClick={handleInterestClick}
      />
    </>
  );
};

export default PropertyCard;
