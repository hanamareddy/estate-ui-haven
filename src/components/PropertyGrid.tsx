
import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
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

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          if (page === 1) {
            setProperties(data);
          } else {
            setProperties(prevProps => [...prevProps, ...data]);
          }
          setHasMore(data.length === propertiesPerPage && properties.length + data.length < (count || 0));
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, activeStatus, activeType, propertiesPerPage]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <FilterBar 
        onStatusChange={setActiveStatus} 
        onTypeChange={setActiveType}
        activeStatus={activeStatus}
        activeType={activeType}
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
              status: property.status
            }} 
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <span className="loading loading-spinner loading-lg"></span>
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
