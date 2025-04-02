
import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const propertiesPerPage = 6;

  // Add these state variables for FilterBar
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .range((page - 1) * propertiesPerPage, page * propertiesPerPage - 1);

        if (activeStatus !== 'all') {
          query = query.eq('status', activeStatus);
        }

        if (activeType !== 'all') {
          query = query.eq('type', activeType);
        }

        if (location) {
          query = query.or(`address.ilike.%${location}%,city.ilike.%${location}%,state.ilike.%${location}%`);
        }

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          // Add additional data like seller info, amenities, etc.
          const enhancedData = data.map(property => ({
            ...property,
            seller: {
              name: `Agent ${property.id % 5 + 1}`,
              phone: `+91 98765 4${property.id % 10000}`,
              email: `agent${property.id % 5 + 1}@example.com`,
            },
            amenities: [
              'Power Backup', 
              'Car Parking', 
              property.id % 2 === 0 ? 'Swimming Pool' : 'Gym',
              '24x7 Water Supply',
              'Security'
            ],
            builtYear: 2015 + (property.id % 8),
            priority: property.id % 3 === 0 ? 'high' : property.id % 3 === 1 ? 'medium' : 'low'
          }));
          
          if (page === 1) {
            setProperties(enhancedData);
          } else {
            setProperties(prevProps => [...prevProps, ...enhancedData]);
          }
          setHasMore(data.length === propertiesPerPage && properties.length + data.length < (count || 0));
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, activeStatus, activeType, location, propertiesPerPage]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleLocationChange = (newLocation) => {
    setPage(1); // Reset to first page when changing location
    setLocation(newLocation);
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <FilterBar 
        onStatusChange={setActiveStatus} 
        onTypeChange={setActiveType}
        activeStatus={activeStatus}
        activeType={activeType}
        onLocationChange={handleLocationChange}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map(property => (
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
              status: property.status,
              seller: property.seller,
              amenities: property.amenities,
              builtYear: property.builtYear,
              priority: property.priority
            }} 
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={loading}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
