
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOptionsProps {
  sortValue: string;
  onSortChange: (value: string) => void;
}

export const SortOptions = ({ sortValue, onSortChange }: SortOptionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
      <Select value={sortValue} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-high">Price (High to Low)</SelectItem>
          <SelectItem value="price-low">Price (Low to High)</SelectItem>
          <SelectItem value="area-high">Area (High to Low)</SelectItem>
          <SelectItem value="area-low">Area (Low to High)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
