
import React from 'react';
import { Hash, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const PropertyIdFilter = () => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <Hash className="w-4 h-4 mr-1.5 text-accent" />
        Property ID
      </label>
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Enter property ID" 
          className="pl-10 w-full" 
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Enter the unique ID to find a specific property
      </p>
    </div>
  );
};
