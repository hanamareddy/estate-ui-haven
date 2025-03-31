
import React from 'react';
import { Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const YearBuiltFilter = () => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <Clock className="w-4 h-4 mr-1.5 text-accent" />
        Year Built
      </label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Any Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Year</SelectItem>
          <SelectItem value="2020">2020 or newer</SelectItem>
          <SelectItem value="2010">2010 or newer</SelectItem>
          <SelectItem value="2000">2000 or newer</SelectItem>
          <SelectItem value="1990">1990 or newer</SelectItem>
          <SelectItem value="1980">1980 or newer</SelectItem>
          <SelectItem value="older">Before 1980</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
