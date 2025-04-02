
import React from 'react';
import { Bed, Bath, Square, User, MapPin, Phone, Mail, Check, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PropertyDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  type: 'house' | 'apartment' | 'land';
  status: 'for-sale' | 'for-rent';
  onInterestClick: () => void;
  seller?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  builtYear?: number;
  amenities?: string[];
}

const PropertyDetailDialog = ({
  isOpen,
  onOpenChange,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  type,
  status,
  onInterestClick,
  seller = {},
  builtYear,
  amenities = []
}: PropertyDetailDialogProps) => {
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

  // Format status to display properly with null check
  const formatStatus = (statusValue: string | undefined) => {
    if (!statusValue) return '';
    // Handle both case formats (hyphenated or not)
    return statusValue.includes('-') ? 
      statusValue.replace(/-/g, ' ') : statusValue;
  };

  // Default amenities if none provided
  const defaultAmenities = [
    'Power Backup',
    'Car Parking',
    'Lift',
    '24x7 Water Supply'
  ];
  
  const displayAmenities = amenities.length > 0 ? amenities : defaultAmenities;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
            {address}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="aspect-video rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Price:</span>
                  <span className="font-medium">{formatPrice(price)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Type:</span>
                  <span className="font-medium capitalize">{type}</span>
                </div>
                {type !== 'land' && (
                  <>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="font-medium">{bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="font-medium">{bathrooms} bathrooms</span>
                    </div>
                  </>
                )}
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span className="font-medium">{area} ft²</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Status:</span>
                  <span className="font-medium capitalize">{formatStatus(status)}</span>
                </div>
                {builtYear && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="font-medium">Built in {builtYear}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Seller Details Section */}
            <div className="mb-4 p-3 bg-secondary/30 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span className="font-medium">{seller?.name || "Contact property agent"}</span>
                </div>
                {seller?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span>{seller.phone}</span>
                  </div>
                )}
                {seller?.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span>{seller.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                This beautiful {type} is located in a prime location. Perfect for
                {status === 'for-sale' ? ' buying as your dream home' : ' renting and moving in right away'}.
                Contact us for more information or to schedule a viewing.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <ul className="grid grid-cols-2 gap-2">
                {displayAmenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-accent" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="sm:order-2"
          >
            Close
          </Button>
          <Button onClick={onInterestClick} className="sm:order-1">
            I'm Interested
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;
