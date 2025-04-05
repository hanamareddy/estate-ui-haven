
import React from 'react';
import { Search, Filter, X, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import BackToHomeButton from '@/components/BackToHomeButton';

interface DashboardHeaderProps {
  userName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const DashboardHeader = ({
  userName,
  searchQuery,
  setSearchQuery,
  filterVisible,
  setFilterVisible,
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode
}: DashboardHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <BackToHomeButton />
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl font-bold">
              Hello, {userName || 'Seller'}
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <Filter size={20} />
              </Button>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </Button>
              </div>
            </div>
          </div>

          {filterVisible && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('inactive')}
              >
                Inactive
              </Button>
              <Button
                variant={activeFilter === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('draft')}
              >
                Draft
              </Button>
              <Button
                variant={activeFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardHeader;
