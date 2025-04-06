
import React, { useState } from 'react';
import { 
  Bed, Bath, Square, User, MapPin, Phone, Mail, Check, Calendar, Home, 
  KeyRound, Ruler, Tag, Info, ParkingCircle, Droplets, Trees, PanelTop, 
  Wifi, Wind, Flame, Shield, Warehouse, Zap, ArrowUpDown, Dumbbell
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PropertyContactDialog from './PropertyContactDialog';

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
  images?: string[];
  type: 'house' | 'apartment' | 'land';
  status: 'for-sale' | 'for-rent';
  onInterestClick: () => void;
  seller?: {
    name?: string;
    phone?: string;
    email?: string;
    id?: string;
  };
  builtYear?: number;
  amenities?: string[];
  description?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  furnishing?: string;
  parking?: number;
  facingDirection?: string;
  constructionStatus?: string;
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
  images = [],
  type,
  status,
  onInterestClick,
  seller = {},
  builtYear,
  amenities = [],
  description,
  location,
  furnishing = "Semi-Furnished",
  parking = 1,
  facingDirection = "North-East",
  constructionStatus = "Ready to Move"
}: PropertyDetailDialogProps) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const formatPrice = (value: number) => {
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

  const formatStatus = (statusValue: string | undefined) => {
    if (!statusValue) return '';
    return statusValue.includes('-') ? 
      statusValue.split('-').join(' ').replace(/^\w/, (c) => c.toUpperCase()) : 
      statusValue.replace(/^\w/, (c) => c.toUpperCase());
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    
    if (amenityLower.includes('lift') || amenityLower.includes('elevator')) {
      return <ArrowUpDown className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('car') && amenityLower.includes('parking')) {
      return <ParkingCircle className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('pool') || amenityLower.includes('swimming')) {
      return <Droplets className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('garden')) {
      return <Trees className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('balcony')) {
      return <PanelTop className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('power') || amenityLower.includes('electricity')) {
      return <Zap className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('air') || amenityLower.includes('ac')) {
      return <Wind className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('gym')) {
      return <Dumbbell className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('two') && amenityLower.includes('parking')) {
      return <ParkingCircle className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('security')) {
      return <Shield className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('fire')) {
      return <Flame className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('storage')) {
      return <Warehouse className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('water')) {
      return <Droplets className="h-4 w-4 mr-2 text-accent" />;
    }
    
    return <Check className="h-4 w-4 mr-2 text-accent" />;
  };

  const displayAmenities = amenities.length > 0 ? amenities : [
    'Power Backup',
    'Car Parking',
    'Lift',
    '24x7 Water Supply',
    'Security'
  ];

  const propertyImages = images?.length > 0 ? 
    images : 
    (imageUrl ? [imageUrl] : ['/placeholder.svg']);

  const propertyDescription = description || `This beautiful ${type} is located in a prime location. Perfect for
    ${status === 'for-sale' ? ' buying as your dream home' : ' renting and moving in right away'}.
    Contact us for more information or to schedule a viewing.`;

  const handleInterestClick = () => {
    setContactDialogOpen(true);
    if (onInterestClick) {
      onInterestClick();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <ScrollArea className="max-h-[90vh] w-full">
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl">{title}</DialogTitle>
                <DialogDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  {address}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mb-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {propertyImages.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="aspect-video rounded-md overflow-hidden">
                            <img 
                              src={img} 
                              alt={`${title} - Image ${index+1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-black/40 hover:bg-black/60" />
                  <CarouselNext className="right-2 bg-black/40 hover:bg-black/60" />
                </Carousel>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 py-4">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Home className="h-5 w-5 mr-2 text-accent" />
                      Property Details
                    </h3>
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
                        <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span className="font-medium capitalize">{formatStatus(status)}</span>
                      </div>
                      {builtYear && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span className="font-medium">Built in {builtYear}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Info className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span className="font-medium">{constructionStatus}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Ruler className="h-5 w-5 mr-2 text-accent" />
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">Furnishing:</span>
                        <span className="font-medium">{furnishing}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">Parking:</span>
                        <span className="font-medium">{parking} {parking > 1 ? 'spaces' : 'space'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">Facing:</span>
                        <span className="font-medium">{facingDirection}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-secondary/30 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <User className="h-5 w-5 mr-2 text-accent" />
                      Seller Information
                    </h3>
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
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {propertyDescription}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Check className="h-5 w-5 mr-2 text-accent" />
                      Amenities
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {displayAmenities.map((amenity, index) => (
                        <li key={index} className="flex items-center">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {location && (location.latitude || location.longitude) && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Location on Map</h3>
                      <div className="w-full aspect-video bg-secondary/20 flex items-center justify-center rounded-md">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2">Map View Available on Request</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="px-6 py-4 border-t">
            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
              >
                Close
              </Button>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-lg">
                  {formatPrice(price)}
                </p>
                <Button onClick={handleInterestClick}>
                  I'm Interested
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PropertyContactDialog 
        isOpen={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        propertyId={typeof seller?.id === 'string' ? seller.id : ''}
        propertyTitle={title}
        sellerInfo={seller?.id ? { id: seller.id, name: seller.name } : undefined}
      />
    </>
  );
};

export default PropertyDetailDialog;
