
// Only updating the necessary parts of the Programs.tsx file to maintain functionality while improving UI
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
import { usePrograms, ProgramFilter } from "@/hooks/usePrograms";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ComparePrograms from "@/components/programs/ComparePrograms";
import { motion } from "framer-motion";

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
  CircleDollarSign,
  LayoutPanelLeft,
  Share2,
  Grid,
  List,
  Loader2,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/currencyConverter";
import { Program } from '@/components/consultation/types';
import ProgramCard from '@/components/programs/ProgramCard';

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

  // State for favorites and comparison
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-programs", []);
  const [compareList, setCompareList] = useLocalStorage<string[]>("compare-programs", []);
  const [showCompare, setShowCompare] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Create filter object
  const filter: ProgramFilter = {
    studyLevel: studyLevel || undefined,
    location: country || undefined,
    subjects: field ? [field] : undefined,
    budget: budget[1].toString(),
    language: language || undefined,
  };
  
  // Get programs data with filters
  const { data: programsData, isLoading } = usePrograms(filter);
  const programs = programsData || [];
  
  // Calculate pagination values
  const totalItems = programs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem);

  // Get programs for comparison
  const programsToCompare = programs.filter(p => compareList.includes(p.id));

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
          className={currentPage === 1 ? "bg-indigo-600 text-white" : ""}
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
                className={currentPage === i ? "bg-indigo-600 text-white" : ""}
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
              className={currentPage === i ? "bg-indigo-600 text-white" : ""}
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
            className={currentPage === totalPages ? "bg-indigo-600 text-white" : ""}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-7xl mx-auto py-10 px-4 sm:px-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Educational Programs
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse {totalItems} educational programs across Europe
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden border shadow-sm">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-none ${viewMode === "grid" ? "bg-indigo-600" : ""}`}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-none ${viewMode === "list" ? "bg-indigo-600" : ""}`}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center shadow-sm border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
          >
            <Filter className="mr-2 h-4 w-4 text-indigo-600" />
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
          <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md flex items-center gap-2" onClick={() => setShowCompare(true)}>
            <LayoutPanelLeft className="h-4 w-4" />
            Compare ({compareList.length}) Programs
          </Button>
        </div>
      )}
      
      {/* Filters */}
      {showFilters && (
        <Card className="mb-6 border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              Program Filters
            </CardTitle>
            <CardDescription>Refine your search to find the perfect program</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Study Level</label>
                <Select
                  value={studyLevel}
                  onValueChange={(value) => {
                    setStudyLevel(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Country</label>
                <Select
                  value={country}
                  onValueChange={(value) => {
                    setCountry(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Field of Study</label>
                <Select
                  value={field}
                  onValueChange={(value) => {
                    setField(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Language</label>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
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
          <CardFooter className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border-t">
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
              className="border-slate-300 hover:bg-slate-100"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={handleFilterChange}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm"
            >
              Apply Filters
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Results & Pagination Info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} programs
        </p>
        <Select 
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
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
        <Alert className="mb-4 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 shadow-sm">
          <Heart className="h-4 w-4 text-pink-500" />
          <AlertDescription>
            You have {favorites.length} favorite programs. 
            <Button variant="link" className="p-0 h-auto text-pink-600 underline decoration-pink-200 decoration-2 underline-offset-2" onClick={() => setShowFilters(true)}>
              Find more programs matching your interests
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Program Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-md">
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
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 inline-flex mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">No programs found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Try adjusting your filters or search criteria to find programs that match your preferences
          </p>
          <Button 
            onClick={() => {
              setStudyLevel("");
              setCountry("");
              setField("");
              setBudget([0, 50000]);
              setLanguage("");
              handleFilterChange();
            }}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col gap-4"
        }>
          {currentItems.map((program) => (
            <ProgramCard 
              key={program.id}
              program={program}
              isGridView={viewMode === "grid"}
              showMatchScore={true}
              isFavorite={favorites.includes(program.id)}
              isCompare={compareList.includes(program.id)}
              onFavorite={handleToggleFavorite}
              onCompare={handleToggleCompare}
              onShare={handleShareProgram}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
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
    </motion.div>
  );
}
