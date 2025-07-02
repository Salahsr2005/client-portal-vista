import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyDestinationsStateProps {
  onReset?: () => void;
}

export const EmptyDestinationsState: React.FC<EmptyDestinationsStateProps> = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mx-auto bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center"
        >
          <Globe className="w-16 h-16 text-primary/60" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <Search className="w-4 h-4 text-primary" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-foreground">No destinations found</h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          We couldn't find any destinations matching your search criteria. 
          Try adjusting your filters or browse all available destinations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
          {onReset && (
            <Button 
              onClick={onReset}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          )}
          <Button variant="outline">
            Browse All Destinations
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};