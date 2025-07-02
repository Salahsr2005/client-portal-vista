import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Destination } from '@/hooks/useDestinations';
import { EnhancedDestinationCard } from './EnhancedDestinationCard';
import { EmptyDestinationsState } from './EmptyDestinationsState';

interface DestinationGridProps {
  destinations: Destination[];
  onViewDetails: (destination: Destination) => void;
  onApply: (destination: Destination) => void;
  isLoading?: boolean;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  onViewDetails,
  onApply,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="animate-pulse"
          >
            <div className="bg-card rounded-2xl h-96 shadow-lg" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return <EmptyDestinationsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {destinations.map((destination, index) => (
          <motion.div
            key={destination.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ y: -8 }}
          >
            <EnhancedDestinationCard
              destination={destination}
              onViewDetails={onViewDetails}
              onApply={onApply}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};