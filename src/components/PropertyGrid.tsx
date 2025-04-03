
import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import PropertyCompare from './PropertyCompare';
import { RealEstate } from './icons';
import PropertyToolbar from './properties/PropertyToolbar';
import FeaturedProperties from './properties/FeaturedProperties';
import AllProperties from './properties/AllProperties';
import ScrollToTopButton from './properties/ScrollToTopButton';
import usePropertyAPI from '@/hooks/usePropertyAPI';
import { toast } from '@/components/ui/use-toast';

const PropertyGrid = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [compareProperties, setCompareProperties] = useState<any[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [location, setLocation] = useState('');
  const { useProperties } = usePropertyAPI();
  
  // Apply filters
  const filters = {
    ...(activeStatus !== 'all' && { status: activeStatus }),
    ...(activeType !== 'all' && { type: activeType }),
    ...(location && { location })
  };
  
  // Fetch properties with filters
  const { data, isLoading, error } = useProperties(filters);
  
  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Get properties from API response - ensure we have an array
  const properties = data?.properties || [];

  // Handle adding/removing properties to compare
  const toggleCompare = (property: any) => {
    if (compareProperties.some(p => p._id === property._id)) {
      setCompareProperties(compareProperties.filter(p => p._id !== property._id));
    } else {
      if (compareProperties.length < 3) {
        setCompareProperties([...compareProperties, property]);
      } else {
        toast({
          title: "Compare limit reached",
          description: "You can compare up to 3 properties at a time",
          variant: "destructive"
        });
      }
    }
  };

  const clearAllCompare = () => {
    setCompareProperties([]);
  };

  const resetFilters = () => {
    setActiveStatus('all');
    setActiveType('all');
    setLocation('');
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  return (
    <section id="properties" className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <RealEstate className="h-6 w-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Explore Our Properties</h2>
          </div>
          <p className="text-muted-foreground">
            Browse our curated selection of premium properties available for sale and rent
          </p>
        </div>
        
        <PropertyToolbar />
        
        <FilterBar 
          onStatusChange={setActiveStatus}
          onTypeChange={setActiveType}
          activeStatus={activeStatus}
          activeType={activeType}
          location={location}
          onLocationChange={handleLocationChange}
        />
        
        <FeaturedProperties 
          properties={properties}
          compareProperties={compareProperties}
          toggleCompare={toggleCompare}
          isLoading={isLoading}
          error={error}
        />
        
        <AllProperties 
          properties={properties}
          compareProperties={compareProperties}
          toggleCompare={toggleCompare}
          resetFilters={resetFilters}
          isLoading={isLoading}
          error={error}
        />
        
        <PropertyCompare 
          selectedProperties={compareProperties} 
          onRemoveProperty={(id) => setCompareProperties(compareProperties.filter(p => p._id !== id))}
          onClearAll={clearAllCompare}
        />
        
        <ScrollToTopButton showScrollTop={showScrollTop} />
      </div>
    </section>
  );
};

export default PropertyGrid;
