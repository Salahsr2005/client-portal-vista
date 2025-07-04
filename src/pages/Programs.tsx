import React, { useState, useMemo } from 'react';
import { usePrograms, ProgramsQueryParams } from '@/hooks/usePrograms';
import { ModernProgramCard } from '@/components/programs/ModernProgramCard';
import { MobileProgramCard } from '@/components/programs/MobileProgramCard';
import MobileFilters from '@/components/programs/MobileFilters';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from '@/hooks/useFavorites';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Languages,
  Euro,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Programs() {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);
  const [withScholarship, setWithScholarship] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setCurrentPage(1);
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    setCurrentPage(1);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
  };

  const handleBudgetChange = (budget: number) => {
    setMaxBudget(budget);
    setCurrentPage(1);
  };

  const handleScholarshipChange = (scholarship: boolean) => {
    setWithScholarship(scholarship);
    setCurrentPage(1);
  };

  // Build query parameters
  const queryParams: ProgramsQueryParams = useMemo(() => ({
    page: currentPage,
    limit: isMobile ? 6 : 12,
    search: searchQuery || undefined,
    country: selectedCountry || undefined,
    level: selectedLevel as any || undefined,
    field: selectedField || undefined,
    language: selectedLanguage || undefined,
    maxBudget: maxBudget || undefined,
    withScholarship: withScholarship || undefined,
  }), [currentPage, searchQuery, selectedCountry, selectedLevel, selectedField, selectedLanguage, maxBudget, withScholarship, isMobile]);

  const { data, isLoading, error } = usePrograms(queryParams);

  const ProgramCardComponent = isMobile ? MobileProgramCard : ModernProgramCard;

  const handleViewDetails = (program: any) => {
    // Navigate to program details page or open modal
    window.open(`/programs/${program.id}`, '_blank');
  };

  const handleApply = (program: any) => {
    // Navigate to application page
    window.open(`/apply/${program.id}`, '_blank');
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900", isMobile ? "p-2" : "p-6")}>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={cn("font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", isMobile ? "text-2xl" : "text-4xl")}>
              Study Programs
            </h1>
            <p className={cn("text-muted-foreground mt-1", isMobile ? "text-sm" : "text-lg")}>
              Discover your perfect educational journey
            </p>
          </div>
          
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className={isMobile ? "p-4" : "p-6"}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search programs, universities, or fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-2 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Quick Filters - Desktop */}
              {!isMobile && (
                <div className="flex gap-2">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {/* Add more countries */}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="Bachelor">Bachelor</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              )}
              
              {/* Mobile Filter Button */}
              {isMobile && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters & Sort
                </Button>
              )}
            </div>
            
            {/* Active Filters */}
            {(selectedCountry || selectedLevel || selectedField || withScholarship) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCountry && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedCountry}
                  </Badge>
                )}
                {selectedLevel && (
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {selectedLevel}
                  </Badge>
                )}
                {withScholarship && (
                  <Badge variant="secondary">
                    Scholarship Available
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Filters */}
        {isMobile && showFilters && (
          <MobileFilters
            selectedCountry={selectedCountry}
            selectedLevel={selectedLevel}
            selectedField={selectedField}
            selectedLanguage={selectedLanguage}
            maxBudget={maxBudget}
            withScholarship={withScholarship}
            onCountryChange={handleCountryChange}
            onLevelChange={handleLevelChange}
            onFieldChange={handleFieldChange}
            onLanguageChange={handleLanguageChange}
            onBudgetChange={handleBudgetChange}
            onScholarshipChange={handleScholarshipChange}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {data ? `${data.totalCount} programs found` : 'Loading...'}
          </div>
          {compareList.length > 0 && (
            <Button size="sm" className="gap-2">
              Compare ({compareList.length})
            </Button>
          )}
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className={cn("grid gap-6", 
            isMobile ? "grid-cols-1" : 
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Error loading programs. Please try again.</p>
            </CardContent>
          </Card>
        ) : data?.programs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No programs found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={cn("grid gap-6", 
              isMobile ? "grid-cols-1" : 
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {data?.programs.map((program) => (
                <ProgramCardComponent
                  key={program.id}
                  program={program}
                  onViewDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && "Previous"}
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
                  disabled={currentPage === data.totalPages}
                >
                  {!isMobile && "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
