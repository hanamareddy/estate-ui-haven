
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { useToast } from '@/hooks/use-toast';
import MobileNavBar from '@/components/MobileNavBar';

const NearbyProperties = () => {
  const [location, setLocation] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const { toast } = useToast();

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

    try {
      // Normally we'd fetch from an API, but for now we'll simulate with dummy data
      setTimeout(() => {
        const dummyProperties = Array(5).fill(null).map((_, i) => ({
          _id: `property-${i}`,
          title: `Property near ${locationInput}`,
          address: `${Math.floor(Math.random() * 1000)} ${locationInput} Street, City`,
          price: Math.floor(Math.random() * 10000000) + 1000000,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          sqft: Math.floor(Math.random() * 2000) + 500,
          images: [{ url: '/placeholder.svg' }],
          type: ['house', 'apartment', 'land'][Math.floor(Math.random() * 3)],
          status: ['for-sale', 'for-rent'][Math.floor(Math.random() * 2)],
        }));
        
        setProperties(dummyProperties);
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch nearby properties.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

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
        
        // Normally we'd use a geocoding service to get the address
        setLocationInput("Current Location");
        setLocation("Current Location");
        
        // Simulate fetching nearby properties
        setTimeout(() => {
          const dummyProperties = Array(7).fill(null).map((_, i) => ({
            _id: `property-${i}`,
            title: `Property near your location`,
            address: `${Math.floor(Math.random() * 1000)} Nearby Street, City`,
            price: Math.floor(Math.random() * 10000000) + 1000000,
            bedrooms: Math.floor(Math.random() * 5) + 1,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            sqft: Math.floor(Math.random() * 2000) + 500,
            images: [{ url: '/placeholder.svg' }],
            type: ['house', 'apartment', 'land'][Math.floor(Math.random() * 3)],
            status: ['for-sale', 'for-rent'][Math.floor(Math.random() * 2)],
          }));
          
          setProperties(dummyProperties);
          setLoading(false);
        }, 1500);
      },
      (error) => {
        toast({
          title: 'Location Error',
          description: error.message || 'Failed to get your current location.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Nearby Properties</h1>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
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
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={loading}
                className="flex-shrink-0"
              >
                Use My Location
              </Button>
            </div>
          </div>
          
          {location && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Showing properties near <span className="font-medium text-foreground">{location}</span>
              </p>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Finding properties near {location || 'your location'}...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property._id}
                propertyData={property}
              />
            ))}
          </div>
        ) : location ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              We couldn't find any properties near this location. Try searching for a different area.
            </p>
          </div>
        ) : null}
      </div>
      <MobileNavBar />
    </div>
  );
};

export default NearbyProperties;
