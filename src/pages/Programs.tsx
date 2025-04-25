
import React, { useState, useMemo } from "react";
import { usePrograms } from "@/hooks/usePrograms";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Search, Sliders, Share2, Clock, BookOpen, MapPin, GraduationCap, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function Programs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: programsData, isLoading } = usePrograms();
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Ensure programs is always an array
  const programs = Array.isArray(programsData) ? programsData : [];

  // Get unique countries for filter dropdown
  const countries = useMemo(() => {
    return Array.from(new Set(programs.map((program) => program.country)))
      .filter(Boolean)
      .sort();
  }, [programs]);

  // Get unique durations for filter dropdown
  const durations = useMemo(() => {
    return Array.from(new Set(programs.map((program) => program.duration)))
      .filter(Boolean)
      .sort();
  }, [programs]);

  // Filter programs based on search term and filters
  const filteredPrograms = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    return programs.filter((program) => {
      const matchesSearch = !searchTerm || 
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = !countryFilter || program.country === countryFilter;
      const matchesDuration = !durationFilter || program.duration === durationFilter;
      
      return matchesSearch && matchesCountry && matchesDuration;
    });
  }, [programs, searchTerm, countryFilter, durationFilter]);

  const handleShare = (programId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const url = `${window.location.origin}/dashboard/programs/${programId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleProgramClick = (programId: string) => {
    navigate(`/dashboard/programs/${programId}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCountryFilter("");
    setDurationFilter("");
  };

  const renderProgramCards = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <Card className="overflow-hidden" key={index}>
          <div className="h-40 bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ));
    }

    if (!filteredPrograms.length) {
      return (
        <div className="col-span-full py-10 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No Programs Found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {(searchTerm || countryFilter || durationFilter) && (
            <Button onClick={resetFilters} variant="outline" className="mt-4">
              Reset Filters
            </Button>
          )}
        </div>
      );
    }

    return filteredPrograms.map((program) => (
      <Card 
        key={program.id}
        className="overflow-hidden cursor-pointer transition-all hover:shadow-md group"
        onClick={() => handleProgramClick(program.id)}
      >
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{ 
            backgroundImage: program.image_url ? 
              `url(${program.image_url})` : 
              `url(/placeholder.svg?height=160&width=400&text=${encodeURIComponent(program.name)})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-bold">{program.name}</h3>
              <p className="text-sm text-white/80">{program.university}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 bg-background/40 hover:bg-background/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleShare(program.id, e)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
              <MapPin className="h-3 w-3" /> {program.country}
            </div>
            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" /> {program.duration}
            </div>
            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
              <DollarSign className="h-3 w-3" /> {program.tuition || 'Contact for fees'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {program.description || 'No description available'}
          </p>
          <div className="flex justify-end">
            <Button size="sm" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {t('view_details')}
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Programs</h1>
          <p className="text-muted-foreground">
            Browse and apply for study programs across different countries
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/applications/new')}
          className="w-full md:w-auto"
        >
          New Application
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Country</label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country as string}>
                      {country as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Duration</label>
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Duration</SelectItem>
                  {durations.map((duration) => (
                    <SelectItem key={duration as string} value={duration as string}>
                      {duration as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-2 md:col-span-2 flex items-end">
              <Button variant="outline" className="mr-2" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderProgramCards()}
        </div>
      </ScrollArea>
    </div>
  );
}
