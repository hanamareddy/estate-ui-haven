
import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import PropertyCompare from './PropertyCompare';
import { RealEstate } from './icons';
import PropertyToolbar from './properties/PropertyToolbar';
import FeaturedProperties from './properties/FeaturedProperties';
import AllProperties from './properties/AllProperties';
import ScrollToTopButton from './properties/ScrollToTopButton';
import properties from '../data/properties';

const PropertyGrid = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [visibleProperties, setVisibleProperties] = useState(properties);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [compareProperties, setCompareProperties] = useState<any[]>([]);
  
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
  
  // Filter properties based on active filters
  useEffect(() => {
    const filtered = properties.filter(property => {
      // Status filter
      if (activeStatus !== 'all' && property.status !== activeStatus) {
        return false;
      }
      
      // Type filter
      if (activeType !== 'all' && property.type !== activeType) {
        return false;
      }
      
      return true;
    });

    setVisibleProperties(filtered);
  }, [activeStatus, activeType]);

  // Handle adding/removing properties to compare
  const toggleCompare = (property: any) => {
    if (compareProperties.some(p => p.id === property.id)) {
      setCompareProperties(compareProperties.filter(p => p.id !== property.id));
    } else {
      if (compareProperties.length < 3) {
        setCompareProperties([...compareProperties, property]);
      } else {
        // Show toast or alert that max 3 properties can be compared
        alert("You can compare up to 3 properties at a time");
      }
    }
  };

  const clearAllCompare = () => {
    setCompareProperties([]);
  };

  const resetFilters = () => {
    setActiveStatus('all');
    setActiveType('all');
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
        />
        
        <FeaturedProperties 
          properties={visibleProperties}
          compareProperties={compareProperties}
          toggleCompare={toggleCompare}
        />
        
        <AllProperties 
          properties={visibleProperties}
          compareProperties={compareProperties}
          toggleCompare={toggleCompare}
          resetFilters={resetFilters}
        />
        
        <PropertyCompare 
          selectedProperties={compareProperties} 
          onRemoveProperty={(id) => setCompareProperties(compareProperties.filter(p => p.id !== id))}
          onClearAll={clearAllCompare}
        />
        
        <ScrollToTopButton showScrollTop={showScrollTop} />
      </div>
    </section>
  );
};

export default PropertyGrid;
