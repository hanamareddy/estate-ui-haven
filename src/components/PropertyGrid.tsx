
import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import MobileNavBar from './MobileNavBar';

const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const propertiesPerPage = 6;

  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [location, setLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('*', { count: 'exact' });

        const rangeStart = (page - 1) * propertiesPerPage;
        const rangeEnd = page * propertiesPerPage - 1;
        query = query.range(rangeStart, rangeEnd);

        if (activeStatus !== 'all') {
          query = query.eq('status', activeStatus);
        }

        if (activeType !== 'all') {
          query = query.eq('type', activeType);
        }

        if (location) {
          query = query.or(`address.ilike.%${location}%,city.ilike.%${location}%,state.ilike.%${location}%`);
        }

        switch (sortOrder) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'size-large':
            query = query.order('area', { ascending: false });
            break;
          case 'popular':
            query = query.order('views', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const enhancedData = data.map((property: any) => ({
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
          
          const totalCount = count || 0;
          const currentCount = (page === 1 ? 0 : properties.length) + data.length;
          setHasMore(data.length === propertiesPerPage && currentCount < totalCount);
        } else {
          // If no data from Supabase, create some mock properties
          if (page === 1) {
            const mockProperties = Array.from({ length: 6 }, (_, i) => ({
              id: i + 1,
              title: `${['Luxury', 'Cozy', 'Modern', 'Spacious', 'Elegant', 'Charming'][i % 6]} ${['Apartment', 'House', 'Villa', 'Condo', 'Penthouse', 'Cottage'][i % 6]}`,
              address: `${['123 Main St', '456 Oak Ave', '789 Pine Blvd', '321 Maple Rd', '654 Cedar Ln', '987 Elm Dr'][i % 6]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][i % 6]}`,
              price: 250000 + (i * 100000),
              bedrooms: (i % 3) + 2,
              bathrooms: (i % 2) + 1,
              area: 1000 + (i * 200),
              images: [{ url: `/placeholder.svg` }],
              type: ['apartment', 'house', 'land'][i % 3],
              status: i % 2 === 0 ? 'for-sale' : 'for-rent',
              seller: {
                name: `Agent ${i % 5 + 1}`,
                phone: `+91 98765 4${i % 10000}`,
                email: `agent${i % 5 + 1}@example.com`,
              },
              amenities: [
                'Power Backup', 
                'Car Parking', 
                i % 2 === 0 ? 'Swimming Pool' : 'Gym',
                '24x7 Water Supply',
                'Security'
              ],
              builtYear: 2015 + (i % 8),
              priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low'
            }));
            
            setProperties(mockProperties);
            setHasMore(false);
          }
        }
      } catch (error: any) {
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
  }, [page, activeStatus, activeType, location, sortOrder, propertiesPerPage, properties.length]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleLocationChange = (newLocation: string) => {
    setPage(1);
    setLocation(newLocation);
  };

  const handleSortChange = (newSortOrder: string) => {
    setPage(1);
    setSortOrder(newSortOrder);
  };

  const filterBarProps = {
    onStatusChange: setActiveStatus,
    onTypeChange: setActiveType,
    activeStatus: activeStatus,
    activeType: activeType,
    location: location,
    onLocationChange: handleLocationChange,
    sortOrder: sortOrder,
    onSortChange: handleSortChange
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <FilterBar 
        {...filterBarProps}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map((property: any) => (
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
              images: property.images ? property.images : [{url: '/placeholder.svg'}],
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
      
      <MobileNavBar />
    </div>
  );
};

export default PropertyGrid;
