
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InquiryStatusFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts?: {
    all: number;
    pending: number;
    responded: number;
    closed: number;
  };
}

const InquiryStatusFilter: React.FC<InquiryStatusFilterProps> = ({ 
  activeFilter, 
  onFilterChange,
  counts = { all: 0, pending: 0, responded: 0, closed: 0 }
}) => {
  return (
    <div className="mb-4">
      <Tabs value={activeFilter} onValueChange={onFilterChange}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">
            All
            {counts.all > 0 && <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full px-2">{counts.all}</span>}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {counts.pending > 0 && <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 rounded-full px-2">{counts.pending}</span>}
          </TabsTrigger>
          <TabsTrigger value="responded">
            Responded
            {counts.responded > 0 && <span className="ml-1 text-xs bg-green-100 text-green-800 rounded-full px-2">{counts.responded}</span>}
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed
            {counts.closed > 0 && <span className="ml-1 text-xs bg-gray-100 text-gray-800 rounded-full px-2">{counts.closed}</span>}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default InquiryStatusFilter;
