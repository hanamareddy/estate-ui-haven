
import React from 'react';
import ActionButton from '../ActionButton';

interface SortOptionsProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

export const SortOptions = ({ sortOrder, setSortOrder }: SortOptionsProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-border animate-slide-down">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-4">
          <h3 className="text-sm font-medium mb-3">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            <ActionButton 
              size="sm" 
              active={sortOrder === 'newest'} 
              activeColor="bg-accent text-white"
              onClick={() => setSortOrder('newest')}
            >
              Newest
            </ActionButton>
            <ActionButton 
              size="sm" 
              active={sortOrder === 'price-low'} 
              activeColor="bg-accent text-white"
              onClick={() => setSortOrder('price-low')}
            >
              Price: Low to High
            </ActionButton>
            <ActionButton 
              size="sm" 
              active={sortOrder === 'price-high'} 
              activeColor="bg-accent text-white"
              onClick={() => setSortOrder('price-high')}
            >
              Price: High to Low
            </ActionButton>
            <ActionButton 
              size="sm" 
              active={sortOrder === 'size-large'} 
              activeColor="bg-accent text-white"
              onClick={() => setSortOrder('size-large')}
            >
              Size: Largest
            </ActionButton>
            <ActionButton 
              size="sm" 
              active={sortOrder === 'popular'} 
              activeColor="bg-accent text-white"
              onClick={() => setSortOrder('popular')}
            >
              Most Popular
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
