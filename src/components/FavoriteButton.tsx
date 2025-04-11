
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import useFavorites from '@/hooks/useFavorites';
import mongoAuthService from '@/services/mongoAuthService';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  propertyId, 
  size = 'md', 
  showText = false,
  variant = 'default'
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToFavorites, removeFromFavorites, checkIsFavorite, refreshFavorites } = useFavorites();
  const navigate = useNavigate();

  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  // Get CSS classes based on button size
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return showText ? 'h-8 px-3' : 'h-8 w-8';
      case 'lg': return showText ? 'h-12 px-5' : 'h-12 w-12';
      default: return showText ? 'h-10 px-4' : 'h-10 w-10';
    }
  };

  // Check if property is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!mongoAuthService.isAuthenticated()) return;
      
      try {
        const favorite = await checkIsFavorite(propertyId);
        setIsFavorite(favorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [propertyId, checkIsFavorite]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    // If not authenticated, redirect to login
    if (!mongoAuthService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save properties to favorites",
      });
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await removeFromFavorites(propertyId);
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Property has been removed from your favorites",
        });
      } else {
        await addToFavorites(propertyId);
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Property has been added to your favorites",
        });
      }
      
      // Refresh favorites list in the app
      refreshFavorites();
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={showText ? 'default' : 'icon'}
      className={`${getSizeClasses()} ${isFavorite ? 'text-red-500 hover:text-red-600' : ''}`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart 
        size={getIconSize()} 
        className={isFavorite ? 'fill-current' : ''}
      />
      {showText && <span className="ml-2">
        {isFavorite ? 'Saved' : 'Save'}
      </span>}
    </Button>
  );
};

export default FavoriteButton;
