
import React from 'react';
import { Search, Grid, ListFilter, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResultsHeaderProps {
  programCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
  toggleFilter: (filter: string, value?: any) => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  programCount,
  searchQuery,
  setSearchQuery,
  isGridView,
  setIsGridView,
  toggleFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Recommended Programs</h2>
        <p className="text-muted-foreground">
          Based on your preferences, we found {programCount} matching programs
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
            className="pl-8 w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant={isGridView ? "default" : "outline"}
            size="icon"
            onClick={() => setIsGridView(true)}
            className={`h-9 w-9 rounded-r-none ${isGridView ? '' : 'border-r-0'}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={!isGridView ? "default" : "outline"}
            size="icon"
            onClick={() => setIsGridView(false)}
            className={`h-9 w-9 rounded-l-none ${!isGridView ? '' : 'border-l-0'}`}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="icon" onClick={() => toggleFilter('all')}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
