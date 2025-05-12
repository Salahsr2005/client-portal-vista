
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const getFilterLabel = (key: string) => {
    switch(key) {
      case 'level': return 'Study Level';
      case 'location':
      case 'destination': return 'Location';
      case 'duration': return 'Duration';
      case 'budget': return 'Budget';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };
  
  const getFilterColor = (key: string) => {
    switch(key) {
      case 'level': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'location':
      case 'destination': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'duration': return 'bg-green-100 text-green-800 border-green-200';
      case 'budget': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <motion.div 
      className="flex flex-wrap gap-2 pb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {Object.entries(activeFilters).map(([key, active]) => 
          active && (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant="outline" 
                className={`px-3 py-1.5 font-medium ${getFilterColor(key)} hover:bg-opacity-90 transition-colors`}
              >
                {getFilterLabel(key)}
                <X 
                  className="ml-1.5 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors" 
                  onClick={() => toggleFilter(key)} 
                />
              </Badge>
            </motion.div>
          )
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs px-3 py-1.5 hover:bg-red-50 hover:text-red-600 transition-colors"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </motion.div>
    </motion.div>
  );
};
