
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { toast } from '@/components/ui/use-toast';

const LocationPropertiesSearch = () => {
  const [location, setLocation] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  // Function to search properties by location
  const handleSearch = async () => {
    if (!locationInput.trim()) {
      toast({
        title: 'Location Required',
        description: 'Please enter a location to search for nearby properties.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setLocation(locationInput);
    setProperties([]); // Clear previous results

    
  };

  // Handle using the user's current geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationInput("Current Location");
        setLocation("Current Location");
        
        // try {
        //   we'd use the coordinates to query properties near the 
        //   const { data, error } = await s

        //   if (error) throw error;
          
        //   if (data && data.length > 0) {
        //     // In real implementation, we would calculate distances and sort by proximity
        //     setProperties(data);
        //   } else {
        //     toast({
        //       title: 'No Nearby Properties',
        //       description: 'We couldn\'t find any properties near your current location.',
        //     });
        //   }
        // } catch (error) {
        //   console.error('Error fetching nearby properties:', error);
        //   toast({
        //     title: 'Error',
        //     description: 'Failed to fetch nearby properties.',
        //     variant: 'destructive',
        //   });
        // } finally {
        //   setLoading(false);
        // }
      },
      (error) => {
        setLoading(false);
        toast({
          title: 'Location Error',
          description: error.message || 'Failed to get your current location.',
          variant: 'destructive',
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Find Properties by Location</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input 
            type="text" 
            placeholder="Enter location (city, area, etc.)" 
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="flex-shrink-0"
          >
            {loading ? 
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : 
              <><Search className="mr-2 h-4 w-4" /> Search</>
            }
          </Button>
          <Button
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="flex-shrink-0"
          >
            {loading && userLocation ? 
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
              <MapPin className="mr-2 h-4 w-4" />
            }
            Use My Location
          </Button>
        </div>
      </div>
      
      {location && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {loading ? 
              `Searching for properties near ${location}...` : 
              `Showing properties near ${location}`
            }
          </p>
        </div>
      )}

      {properties.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              propertyData={{
                _id: property.id,
                title: property.title,
                address: property.address,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sqft: property.area,
                images: property.images ? [{url: property.images[0]}] : [{url: '/placeholder.svg'}],
                type: property.type,
                status: property.status
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPropertiesSearch;
