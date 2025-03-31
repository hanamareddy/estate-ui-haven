import { Eye, EyeOff, Edit, Trash2, Users, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft: number;
  images: string[];
  status: string;
  interestedUsers: number;
  viewCount: number;
  favoriteCount: number;
  created: string;
}

interface SellerPropertyCardProps {
  property: Property;
  onToggleStatus: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SellerPropertyCard = ({ 
  property, 
  onToggleStatus, 
  onEdit,
  onDelete 
}: SellerPropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            property.status === 'active' 
              ? 'bg-success text-success-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {property.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{property.address}</p>
          </div>
          <div className="text-lg font-bold text-accent">{formatPrice(property.price)}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{property.interestedUsers} Interested</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{property.viewCount} Views</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{property.favoriteCount} Favorites</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Listed: {new Date(property.created).toLocaleDateString()}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-secondary/50">
            {property.type}
          </Badge>
          {property.bedrooms && (
            <Badge variant="outline" className="bg-secondary/50">
              {property.bedrooms} Beds
            </Badge>
          )}
          {property.bathrooms && (
            <Badge variant="outline" className="bg-secondary/50">
              {property.bathrooms} Baths
            </Badge>
          )}
          <Badge variant="outline" className="bg-secondary/50">
            {property.sqft.toLocaleString()} sqft
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-secondary/30 p-4">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onToggleStatus(property.id)}
              >
                {property.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {property.status === 'active' ? 'Hide Listing' : 'Show Listing'}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onEdit && onEdit(property.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Listing</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onDelete && onDelete(property.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Listing</TooltipContent>
          </Tooltip>
        </div>
        
        <Button onClick={() => onEdit && onEdit(property.id)}>Manage Listing</Button>
      </CardFooter>
    </Card>
  );
};
