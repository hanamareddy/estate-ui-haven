
import React from 'react';
import { Heart } from 'lucide-react';
import ActionButton from '../ActionButton';

interface PropertyImageProps {
  imageUrl: string;
  title: string;
  status: 'for-sale' | 'for-rent';
  type: 'house' | 'apartment' | 'land';
  isFavorited: boolean;
  isCompared?: boolean;
  onFavoriteClick: () => void;
  isImageLoaded: boolean;
  onImageLoad: () => void;
}

const PropertyImage = ({
  imageUrl,
  title,
  status,
  type,
  isFavorited,
  isCompared,
  onFavoriteClick,
  isImageLoaded,
  onImageLoad
}: PropertyImageProps) => {
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      {/* Loading skeleton */}
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      
      <img
        src={imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={onImageLoad}
      />
      
      {/* Property status badge */}
      <div className="absolute top-3 left-3">
        <span className={`badge ${
          status === 'for-sale' ? 'bg-accent text-white' : 'bg-primary text-white'
        }`}>
          {status === 'for-sale' ? 'For Sale' : 'For Rent'}
        </span>
      </div>
      
      {/* Property type badge */}
      <div className="absolute top-3 right-3">
        <span className="badge bg-white/80 backdrop-blur-sm text-foreground">
          {type === 'house' ? 'House' : type === 'apartment' ? 'Apartment' : 'Land'}
        </span>
      </div>
      
      {/* Favorite button */}
      <ActionButton
        icon={<Heart className={`w-4 h-4 ${isFavorited ? 'fill-accent text-accent' : ''}`} />}
        variant="ghost"
        className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={onFavoriteClick}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      />
      
      {/* Compare badge/indicator - Add this if the property is being compared */}
      {isCompared && (
        <div className="absolute bottom-3 left-3">
          <span className="badge bg-primary/90 text-white text-xs">
            Comparing
          </span>
        </div>
      )}
    </div>
  );
};

export default PropertyImage;
