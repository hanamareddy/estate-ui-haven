
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, Bath, Square, User, MapPin, Phone, Mail, Check, Calendar, Home, KeyRound, Ruler, Tag, Info, ArrowLeft, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackToHomeButton from '@/components/BackToHomeButton';
import PropertyContactDialog from '@/components/property/PropertyContactDialog';
import usePropertyAPI from '@/hooks/usePropertyAPI';
import { toast } from '@/hooks/use-toast';
import mongoAuthService from '@/services/mongoAuthService';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useProperty } = usePropertyAPI();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const user = mongoAuthService.getCurrentUser();

  // Fetch property data
  const { data: property, isLoading, error } = useProperty(id || '');

  const handleInterestClick = () => {
    setIsDialogOpen(true);
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorited 
        ? 'This property has been removed from your favorites.' 
        : 'This property has been added to your favorites.',
      variant: isFavorited ? 'destructive' : 'default',
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleInterestSuccess = () => {
    toast({
      title: 'Interest sent to seller!',
      description: 'The property owner will contact you soon.',
      duration: 4000,
    });
  };

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

  // Get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('power') || amenityLower.includes('electricity')) {
      return <KeyRound className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('parking')) {
      return <MapPin className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('lift') || amenityLower.includes('elevator')) {
      return <Square className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('water')) {
      return <Bath className="h-4 w-4 mr-2 text-accent" />;
    } else if (amenityLower.includes('security')) {
      return <User className="h-4 w-4 mr-2 text-accent" />;
    }
    return <Check className="h-4 w-4 mr-2 text-accent" />;
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 flex justify-center items-center min-h-[60vh]">Loading property details...</div>;
  }

  if (error || !property) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center min-h-[60vh]">
        <h2 className="text-xl mb-4">Failed to load property details</h2>
        <BackToHomeButton />
      </div>
    );
  }

  // Process property data for display
  const mappedType = (property.type?.toLowerCase() === 'apartment' || property.type?.toLowerCase() === 'house' || property.type?.toLowerCase() === 'land') 
    ? (property.type.toLowerCase() as 'apartment' | 'house' | 'land') 
    : 'house';
  
  const mappedStatus = property.status?.toLowerCase().includes('sale') 
    ? 'for-sale' 
    : 'for-rent';

  const images = property.images?.map(img => img.url) || ['/placeholder.svg'];
  const amenities = property.amenities || ['Power Backup', 'Car Parking', 'Lift', '24x7 Water Supply', 'Security'];
  
  // Description with minimum of 5-10 words
  const description = property.description || 
    `This beautiful ${mappedType} in ${property.address} offers a perfect blend of comfort and convenience. Ideal for families and professionals alike, with excellent connectivity to nearby amenities.`;

  return (
    <div className="bg-background min-h-screen">
      {/* Back button and header */}
      <div className="container mx-auto py-4 px-4 md:px-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{property.title}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{property.address}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleFavoriteClick}
              className={isFavorited ? "text-red-500" : ""}
            >
              <Heart className={isFavorited ? "fill-current" : ""} />
            </Button>
            <div className="text-2xl font-bold">
              {formatPrice(property.price)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {mappedStatus === 'for-rent' ? '/month' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="aspect-[16/9] md:aspect-[21/9] rounded-md overflow-hidden">
                      <img 
                        src={img} 
                        alt={`${property.title} - Image ${index+1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          <div className="flex justify-center mt-4 md:hidden">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
          </Carousel>
        </div>

        {/* Main content area */}
        <div className="grid md:grid-cols-3 gap-8 pb-12">
          {/* Left: Property Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Home className="h-5 w-5 mr-2 text-accent" />
                Property Overview
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                {mappedType !== 'land' && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Bedrooms</span>
                      <div className="flex items-center mt-1">
                        <Bed className="h-4 w-4 mr-1.5 text-accent" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Bathrooms</span>
                      <div className="flex items-center mt-1">
                        <Bath className="h-4 w-4 mr-1.5 text-accent" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Area</span>
                  <div className="flex items-center mt-1">
                    <Square className="h-4 w-4 mr-1.5 text-accent" />
                    <span className="font-medium">{property.sqft} sq.ft</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Type</span>
                  <div className="flex items-center mt-1">
                    <Home className="h-4 w-4 mr-1.5 text-accent" />
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <div className="flex items-center mt-1">
                    <Tag className="h-4 w-4 mr-1.5 text-accent" />
                    <span className="font-medium">
                      {mappedStatus.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                    </span>
                  </div>
                </div>
                {property.builtYear && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Year Built</span>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1.5 text-accent" />
                      <span className="font-medium">{property.builtYear}</span>
                    </div>
                  </div>
                )}
              </div>

              {(property.furnishing || property.parking || property.facingDirection || property.constructionStatus) && (
                <>
                  <div className="border-t border-border my-6"></div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-accent" />
                    Property Specifications
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {property.furnishing && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Furnishing</span>
                        <span className="font-medium mt-1">{property.furnishing}</span>
                      </div>
                    )}
                    {property.parking !== undefined && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Parking</span>
                        <span className="font-medium mt-1">{property.parking} {property.parking > 1 ? 'spaces' : 'space'}</span>
                      </div>
                    )}
                    {property.facingDirection && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Facing</span>
                        <span className="font-medium mt-1">{property.facingDirection}</span>
                      </div>
                    )}
                    {property.constructionStatus && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Construction</span>
                        <span className="font-medium mt-1">{property.constructionStatus}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Check className="h-5 w-5 mr-2 text-accent" />
                  Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center bg-secondary/20 rounded-md p-3">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact and Actions */}
          <div className="md:col-span-1">
            {/* Seller Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-accent" />
                Property Contact
              </h2>
              
              {property.seller && (
                <div className="space-y-4 mb-6">
                  {property.seller.name && (
                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{property.seller.name}</div>
                        <div className="text-sm text-muted-foreground">Property Owner</div>
                      </div>
                    </div>
                  )}
                  
                  {property.seller.phone && (
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{property.seller.phone}</div>
                        <div className="text-sm text-muted-foreground">Call for inquiries</div>
                      </div>
                    </div>
                  )}
                  
                  {property.seller.email && (
                    <div className="flex items-start">
                      <Mail className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium break-all">{property.seller.email}</div>
                        <div className="text-sm text-muted-foreground">Email for details</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <Button className="w-full" onClick={handleInterestClick}>
                  I'm Interested
                </Button>
                {!user && (
                  <div className="text-xs text-muted-foreground text-center">
                    You'll need to provide your contact details
                  </div>
                )}
                <Button variant="outline" className="w-full" onClick={handleBackClick}>
                  View Similar Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PropertyContactDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        propertyTitle={property.title}
        propertyId={id || ''}
        onSuccess={handleInterestSuccess}
      />
    </div>
  );
};

export default PropertyDetail;
