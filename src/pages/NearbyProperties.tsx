import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { getDistance } from 'geolib';
import { Property, NearbyProperty } from '@/types/databaseModels';
import PropertyCard from '@/components/PropertyCard';

const NearbyProperties = () => {
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [properties, setProperties] = useState<NearbyProperty[]>([]);
  const [distance, setDistance] = useState('5'); // In kilometers
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    getUserLocation();
  }, []);
  
  const getUserLocation = () => {
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLoadingLocation(false);
          fetchNearbyProperties({ latitude, longitude }, distance);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not access your location. Using a default location.');
          setLoadingLocation(false);
          
          const defaultLocation = { latitude: 19.0760, longitude: 72.8777 };
          setUserLocation(defaultLocation);
          fetchNearbyProperties(defaultLocation, distance);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      
      const defaultLocation = { latitude: 19.0760, longitude: 72.8777 };
      setUserLocation(defaultLocation);
      fetchNearbyProperties(defaultLocation, distance);
    }
  };
  
  const fetchNearbyProperties = async (location: {latitude: number, longitude: number}, distanceKm: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('property_listings')
        .select('*');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }
      
      const propertiesWithLocation = data.map(item => {
        const randomLat = location.latitude + (Math.random() - 0.5) * 0.05;
        const randomLng = location.longitude + (Math.random() - 0.5) * 0.05;
        
        return {
          id: item.id,
          title: item.name,
          price: item.sale,
          address: `${item.city}, India`,
          type: Math.random() > 0.5 ? 'house' : 'apartment',
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          sqft: Math.floor(Math.random() * 2000) + 500,
          status: 'for-sale',
          latitude: randomLat,
          longitude: randomLng,
          images: ['/placeholder.svg']
        } as NearbyProperty;
      });
      
      const distanceInMeters = parseInt(distanceKm) * 1000;
      
      const nearbyProperties = propertiesWithLocation.filter((property: NearbyProperty) => {
        if (!property.latitude || !property.longitude) return false;
        
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: property.latitude, longitude: property.longitude }
        );
        
        property.distanceInKm = (distance / 1000).toFixed(1);
        
        return distance <= distanceInMeters;
      });
      
      nearbyProperties.sort((a: NearbyProperty, b: NearbyProperty) => 
        parseFloat(a.distanceInKm || '0') - parseFloat(b.distanceInKm || '0')
      );
      
      setProperties(nearbyProperties);
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
      setError('Failed to fetch properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userLocation) {
      fetchNearbyProperties(userLocation, distance);
    }
  }, [distance]);
  
  const handleDistanceChange = (value: string) => {
    setDistance(value);
  };
  
  const refreshLocation = () => {
    getUserLocation();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nearby Properties</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 mb-6 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          <span className="font-medium">
            {loadingLocation ? 'Finding your location...' : 'Properties within:'}
          </span>
        </div>
        
        <Select value={distance} onValueChange={handleDistanceChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 km</SelectItem>
            <SelectItem value="2">2 km</SelectItem>
            <SelectItem value="5">5 km</SelectItem>
            <SelectItem value="10">10 km</SelectItem>
            <SelectItem value="20">20 km</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh Location'}
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 rounded-t-lg" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Properties Found Nearby</h3>
          <p className="text-muted-foreground mb-4">
            Try increasing the search distance or exploring a different area.
          </p>
          <Button onClick={() => setDistance('20')}>
            Expand Search to 20 km
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-muted-foreground">
            Found {properties.length} properties within {distance} km
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <div className="absolute top-2 right-2 z-10 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                  {property.distanceInKm} km away
                </div>
                <PropertyCard 
                  id={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.sqft}
                  imageUrl={property.images?.[0] || '/placeholder.svg'}
                  type={property.type as any}
                  status={property.status as any}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyProperties;
