
import React, { useState } from 'react';
import { X, ArrowLeftRight, PlusCircle,Home, 
  Building,LandPlot } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from './icons';

interface PropertyInfo {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  type: string;
  status: string;
  amenities?: string[];
}

interface PropertyCompareProps {
  selectedProperties: PropertyInfo[];
  onRemoveProperty: (id: string) => void;
  onClearAll: () => void;
}

export const PropertyCompare = ({ 
  selectedProperties, 
  onRemoveProperty, 
  onClearAll 
}: PropertyCompareProps) => {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'house': return 'bg-blue-100 text-blue-800';
      case 'apartment': return 'bg-purple-100 text-purple-800';
      case 'land': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
    const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'house':
        return <Home className="h-5 w-5" />;
      case 'apartment':
        return <Building className="h-5 w-5" />;
      case 'land':
        return <LandPlot className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  return (
    <>
      {selectedProperties.length > 0 && (
        <div className="fixed bottom-5 right-5 z-40">
          <Button 
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsCompareOpen(true)}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare ({selectedProperties.length})
          </Button>
        </div>
      )}

      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-accent" />
              Compare Properties
            </DialogTitle>
          </DialogHeader>
          
          {selectedProperties.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No properties selected for comparison</p>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 text-left font-medium text-sm w-1/4">Property</th>
                      {selectedProperties.map(property => (
                        <th key={property.id} className="p-3 relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                            onClick={() => onRemoveProperty(property.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Image</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          <div className="relative rounded-md overflow-hidden h-32">
                            <img 
                              src={property.imageUrl} 
                              alt={property.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                              <p className="text-white font-medium text-sm truncate w-full">
                                {property.title}
                              </p>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Price</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border font-bold text-accent">
                          {formatPrice(property.price)}
                          <Badge className="ml-2" variant={property.status === 'for-rent' ? 'outline' : 'default'}>
                            {property.status === 'for-rent' ? 'Rent' : 'Sale'}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Type</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          {getPropertyTypeIcon(property.type)}
                          <span className={`px-2 py-1 rounded- text-xs  ${getTypeColor(property.type)}`}>
                            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Bedrooms</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          {property.bedrooms || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Bathrooms</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          {property.bathrooms || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Area (sq ft)</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          {property.area.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Price per sq ft
                        </div>
                      </td>
                      {selectedProperties.map(property => {
                        const pricePerSqFt = property.area ? property.price / property.area : 0;
                        return (
                          <td key={property.id} className="p-3 border-b border-border font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0
                            }).format(pricePerSqFt)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-border text-sm font-medium">Amenities</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="p-3 border-b border-border">
                          <div className="flex flex-wrap gap-1">
                            {property.amenities?.length ? (
                              property.amenities.slice(0, 3).map(amenity => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">No data</span>
                            )}
                            {property.amenities && property.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{property.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <DialogFooter className="flex sm:justify-between gap-2 flex-wrap">
                <Button variant="outline" onClick={onClearAll}>
                  Clear All
                </Button>
                <Button asChild>
                  <a href="#properties">View All Details</a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCompare;
