
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface ActiveFiltersProps {
  activeFilters: { [key: string]: boolean };
  toggleFilter: (filter: string) => void;
  clearAllFilters: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeFilters,
  toggleFilter,
  clearAllFilters
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);
  
  if (!hasActiveFilters) return null;
  
  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {Object.entries(activeFilters).map(([key, active]) => 
        active && (
          <Badge key={key} variant="secondary" className="px-3 py-1">
            {key === 'level' ? 'Study Level' : 
              key === 'location' || key === 'destination' ? 'Location' : 
              key === 'duration' ? 'Duration' : 
              key === 'budget' ? 'Budget' : key}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={() => toggleFilter(key)} 
            />
          </Badge>
        )
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 text-xs"
        onClick={clearAllFilters}
      >
        Clear all
      </Button>
    </motion.div>
  );
};
