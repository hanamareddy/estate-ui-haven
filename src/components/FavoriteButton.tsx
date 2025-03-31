
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteButtonProps {
  propertyId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

const FavoriteButton = ({ propertyId, variant = "ghost", size = "sm", showText = false }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { addFavorite, removeFavorite, checkIsFavorite } = useFavorites();

  useEffect(() => {
    const checkAuthAndFavorite = async () => {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      const isAuth = !!session?.session;
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        // Check if property is in favorites
        const isFav = await checkIsFavorite(propertyId);
        setIsFavorite(isFav);
      }
    };
    
    checkAuthAndFavorite();
  }, [propertyId, checkIsFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save properties to favorites",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let success;
      
      if (isFavorite) {
        success = await removeFavorite(propertyId);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        success = await addFavorite(propertyId);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''} ${showText ? 'mr-2' : ''}`} />
      {showText && (isFavorite ? 'Saved' : 'Save')}
    </Button>
  );
};

export default FavoriteButton;
