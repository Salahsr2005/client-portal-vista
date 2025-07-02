import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterState {
  search: string;
  country: string;
  procedure: string;
}

interface DestinationFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  countries: string[];
  procedures: string[];
  resultCount: number;
}

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  filters,
  onFiltersChange,
  countries,
  procedures,
  resultCount
}) => {
  const clearFilters = () => {
    onFiltersChange({
      search: '',
      country: 'all',
      procedure: 'all'
    });
  };

  const hasActiveFilters = filters.search || filters.country !== 'all' || filters.procedure !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search destinations, countries..."
                  value={filters.search}
                  onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                  className="pl-10 border-0 bg-muted/50 focus:bg-background transition-colors"
                />
              </div>
              
              <Select value={filters.country} onValueChange={(value) => onFiltersChange({ ...filters, country: value })}>
                <SelectTrigger className="border-0 bg-muted/50 hover:bg-background transition-colors">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.procedure} onValueChange={(value) => onFiltersChange({ ...filters, procedure: value })}>
                <SelectTrigger className="border-0 bg-muted/50 hover:bg-background transition-colors">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Procedures" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Procedures</SelectItem>
                  {procedures.map((procedure) => (
                    <SelectItem key={procedure} value={procedure}>
                      {procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={clearFilters}
                variant="outline"
                disabled={!hasActiveFilters}
                className="border-0 bg-muted/50 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-2 pt-2 border-t border-border/50"
              >
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {filters.search}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => onFiltersChange({ ...filters, search: '' })}
                    />
                  </Badge>
                )}
                {filters.country !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Country: {filters.country}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => onFiltersChange({ ...filters, country: 'all' })}
                    />
                  </Badge>
                )}
                {filters.procedure !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Procedure: {filters.procedure}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => onFiltersChange({ ...filters, procedure: 'all' })}
                    />
                  </Badge>
                )}
              </motion.div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                {resultCount} destinations found
              </span>
              <Badge variant="outline" className="text-xs">
                Updated Recently
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};