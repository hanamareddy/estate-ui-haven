
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PropertyStatusFilter = () => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <Sparkles className="w-4 h-4 mr-1.5 text-accent" />
        Property Status
      </label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Any Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Status</SelectItem>
          <SelectItem value="ready">Ready to Move</SelectItem>
          <SelectItem value="under-construction">Under Construction</SelectItem>
          <SelectItem value="resale">Resale</SelectItem>
          <SelectItem value="foreclosure">Foreclosure</SelectItem>
          <SelectItem value="short-sale">Short Sale</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
