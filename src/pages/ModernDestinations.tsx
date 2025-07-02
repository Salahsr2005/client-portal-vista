
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDestinations, Destination } from '@/hooks/useDestinations';
import { DestinationFilters } from '@/components/destinations/DestinationFilters';
import { DestinationStats } from '@/components/destinations/DestinationStats';
import { DestinationGrid } from '@/components/destinations/DestinationGrid';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModernDestinations() {
  const navigate = useNavigate();
  const { data: destinations, isLoading, error } = useDestinations();
  const [filters, setFilters] = useState({
    search: '',
    country: 'all',
    procedure: 'all'
  });

  const filteredDestinations = destinations?.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         dest.country.toLowerCase().includes(filters.search.toLowerCase()) ||
                         dest.procedure_type.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCountry = filters.country === 'all' || dest.country === filters.country;
    const matchesProcedure = filters.procedure === 'all' || dest.procedure_type === filters.procedure;
    
    return matchesSearch && matchesCountry && matchesProcedure;
  });

  const countries = Array.from(new Set(destinations?.map(d => d.country) || []));
  const procedures = Array.from(new Set(destinations?.map(d => d.procedure_type) || []));

  const handleViewDetails = (destination: Destination) => {
    navigate(`/destinations/${destination.id}`);
  };

  const handleApply = (destination: Destination) => {
    // TODO: Implement application flow
    console.log('Apply to destination:', destination.name);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      country: 'all',
      procedure: 'all'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Unable to load destinations</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-7xl py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center text-gradient mb-4">
            <Sparkles className="w-8 h-8 mr-2 text-primary" />
            <h1 className="text-5xl font-bold">Study Destinations</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover amazing study opportunities across Europe with our comprehensive destination guide
          </p>
        </motion.div>

        {/* Stats Cards */}
        <DestinationStats destinations={destinations || []} />

        {/* Search and Filters */}
        <DestinationFilters
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          procedures={procedures}
          resultCount={filteredDestinations?.length || 0}
        />

        {/* Destinations Grid */}
        <div className="mt-8">
          <DestinationGrid
            destinations={filteredDestinations || []}
            onViewDetails={handleViewDetails}
            onApply={handleApply}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
