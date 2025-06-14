import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePrograms, ProgramsQueryParams } from "@/hooks/usePrograms";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ComparePrograms from "@/components/programs/ComparePrograms";
import MobileFilters from "@/components/programs/MobileFilters";
import MobileProgramCard from "@/components/programs/MobileProgramCard";

import { 
  Search, 
  Filter, 
  ChevronRight, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  DollarSign,
  LayoutPanelLeft,
  Share2,
  Grid3X3,
  List
} from "lucide-react";
import { formatCurrency } from "@/utils/currencyConverter";
import ProgramCard from '@/components/consultation/ProgramCard';

export default function Programs() {
  // State for filters and pagination
  const [studyLevel, setStudyLevel] = useState("");
  const [country, setCountry] = useState("");
  const [field, setField] = useState("");
  const [budget, setBudget] = useState([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [language, setLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State for favorites and comparison
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-programs", []);
  const [compareList, setCompareList] = useLocalStorage<string[]>("compare-programs", []);
  const [showCompare, setShowCompare] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Create query params object
  const queryParams: ProgramsQueryParams = {
    page: currentPage,
    limit: itemsPerPage,
    country: country || undefined,
    level: studyLevel as any || undefined,
    field: field || undefined,
    maxBudget: budget[1],
    language: language || undefined,
    withScholarship: false
  };
  
  // Get programs data with filters
  const { data: programsData, isLoading } = usePrograms(queryParams);
  
  // Calculate pagination values - make sure we're working with arrays
  const programs = programsData?.programs || [];
  const totalItems = programsData?.totalCount || 0;
  const totalPages = programsData?.totalPages || 1;
  
  // We don't need to slice here since the API already handles pagination
  const currentItems = programs;

  // Get programs for comparison
  const programsToCompare = programs.filter(p => compareList.includes(p.id)).map(p => ({
    ...p,
    location: p.location || `${p.city}, ${p.country}`,
    duration: p.duration || `${p.duration_months} months`,
  }));

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Function to handle favorite toggle
  const handleToggleFavorite = (programId: string) => {
    setFavorites(prev => {
      if (prev.includes(programId)) {
        toast.info("Removed from favorites");
        return prev.filter(id => id !== programId);
      } else {
        toast.success("Added to favorites");
        return [...prev, programId];
      }
    });
  };
  
  // Function to handle compare toggle
  const handleToggleCompare = (programId: string) => {
    setCompareList(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        if (prev.length >= 3) {
          toast.warning("You can compare up to 3 programs at once");
          return prev;
        }
        setShowCompare(true);
        return [...prev, programId];
      }
    });
  };

  // Function to handle sharing
  const handleShareProgram = (programId: string) => {
    const url = `${window.location.origin}/programs/${programId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this program',
        url: url,
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };
  
  // Helper function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  // Reset compare when unmounting
  useEffect(() => {
    return () => {
      if (compareList.length > 0) {
        setCompareList([]);
      }
    };
  }, []);

  // Function to render pagination numbers
  const renderPaginationNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => paginate(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If we have more than 5 pages, show ellipsis
    if (totalPages > 5) {
      if (currentPage > 3) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }
      
      // Calculate start and end pages to show
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Show pages around current page
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={currentPage === i}
                onClick={() => paginate(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }
    } else {
      // Show all pages if we have 5 or fewer
      for (let i = 2; i < totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i}
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Programs</h1>
            <p className="text-muted-foreground mt-2">
              Browse educational programs across Europe
            </p>
          </div>
          
          {/* Desktop View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex rounded-md overflow-hidden border">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search and Filters */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filters */}
          <div className="sm:hidden">
            <MobileFilters
              studyLevel={studyLevel}
              setStudyLevel={setStudyLevel}
              country={country}
              setCountry={setCountry}
              field={field}
              setField={setField}
              language={language}
              setLanguage={setLanguage}
              budget={budget}
              setBudget={setBudget}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Desktop Filters Toggle */}
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="hidden sm:flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>
      
      {/* Comparison panel */}
      {compareList.length > 0 && showCompare && (
        <ComparePrograms 
          programs={programsToCompare}
          onClose={() => setShowCompare(false)}
          onRemoveProgram={(id) => {
            setCompareList(prev => prev.filter(programId => programId !== id));
          }}
        />
      )}
      
      {/* Compare button */}
      {compareList.length > 0 && !showCompare && (
        <div className="mb-4">
          <Button onClick={() => setShowCompare(true)} className="w-full sm:w-auto">
            <LayoutPanelLeft className="mr-2 h-4 w-4" />
            Compare ({compareList.length}) Programs
          </Button>
        </div>
      )}
      
      {/* Desktop Filters */}
      {showFilters && (
        <Card className="mb-6 hidden sm:block">
          <CardHeader>
            <CardTitle className="text-xl">Filters</CardTitle>
            <CardDescription>Refine your search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Study Level</label>
                <Select
                  value={studyLevel}
                  onValueChange={(value) => {
                    setStudyLevel(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Select
                  value={country}
                  onValueChange={(value) => {
                    setCountry(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Belgium">Belgium</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <Select
                  value={field}
                  onValueChange={(value) => {
                    setField(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fields</SelectItem>
                    <SelectItem value="Business">Business & Management</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Medicine">Medicine & Health</SelectItem>
                    <SelectItem value="Arts">Arts & Humanities</SelectItem>
                    <SelectItem value="Law">Law</SelectItem>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium mb-1">
                  Budget Range (€): {budget[0]} - {budget[1]}
                </label>
                <Slider
                  defaultValue={[0, 50000]}
                  min={0}
                  max={50000}
                  step={1000}
                  value={budget}
                  onValueChange={(value) => {
                    setBudget(value);
                    handleFilterChange();
                  }}
                  className="my-4"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setStudyLevel("");
                setCountry("");
                setField("");
                setBudget([0, 50000]);
                setLanguage("");
                handleFilterChange();
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={handleFilterChange}>Apply Filters</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Results & Pagination Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            "Loading programs..."
          ) : (
            `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} programs`
          )}
        </p>
        <Select 
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="36">36 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Display favorites count if any */}
      {favorites.length > 0 && (
        <Alert className="mb-4 bg-pink-50 border-pink-200">
          <Heart className="h-4 w-4 text-pink-500" />
          <AlertDescription>
            You have {favorites.length} favorite programs. 
            <Button variant="link" className="p-0 h-auto text-pink-600" onClick={() => setShowFilters(true)}>
              Find more programs matching your interests
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Program Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No programs found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search criteria
          </p>
          <Button onClick={() => {
            setStudyLevel("");
            setCountry("");
            setField("");
            setBudget([0, 50000]);
            setLanguage("");
            handleFilterChange();
          }}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile View (always single column with mobile cards) */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-1 gap-4">
              {currentItems.map((program) => (
                <MobileProgramCard
                  key={program.id}
                  program={program}
                  isFavorite={favorites.includes(program.id)}
                  isCompare={compareList.includes(program.id)}
                  onFavorite={handleToggleFavorite}
                  onCompare={handleToggleCompare}
                  onShare={handleShareProgram}
                />
              ))}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
            }>
              {currentItems.map((program) => (
                <ProgramCard 
                  key={program.id}
                  program={program}
                  isGridView={viewMode === "grid"}
                  showScore={true}
                  isFavorite={favorites.includes(program.id)}
                  isCompare={compareList.includes(program.id)}
                  onFavorite={handleToggleFavorite}
                  onCompare={handleToggleCompare}
                  onShare={handleShareProgram}
                />
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationNumbers()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
