
import React, { useState } from 'react';
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
import { usePrograms } from "@/hooks/usePrograms";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, ChevronRight, GraduationCap, MapPin, Calendar, Clock, Star, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/currencyConverter";

export default function Programs() {
  // State for filters and pagination
  const [studyLevel, setStudyLevel] = useState("");
  const [country, setCountry] = useState("");
  const [field, setField] = useState("");
  const [budget, setBudget] = useState([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [language, setLanguage] = useState("");

  // Get programs data with filters
  const { data: programsData, isLoading } = usePrograms({
    studyLevel: studyLevel || undefined,
    location: country || undefined,
    subjects: field ? [field] : undefined,
    budget: budget[1].toString(),
    language: language || undefined,
  });
  
  const programs = programsData || [];
  
  // Calculate pagination values
  const totalItems = programs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page on filter change
  };

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
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground mt-2">
            Browse educational programs across Europe
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center mb-4 md:mb-0"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
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
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
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
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Program Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((program) => (
            <Card key={program.id} className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
              <div 
                className="aspect-[16/9] w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${program.image_url || '/placeholder.svg'})` }}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  {program.matchScore !== undefined && (
                    <div className="bg-muted text-primary px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-amber-500 stroke-amber-500" />
                      {program.matchScore}% match
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-1">
                  {program.university || 'Unknown University'}, {program.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{program.type || 'Degree Program'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatCurrency(program.tuition, 'EUR', 'EUR')} tuition</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {program.hasScholarship && (
                      <Badge variant="secondary" className="text-xs">Scholarship</Badge>
                    )}
                    {program.hasReligiousFacilities && (
                      <Badge variant="secondary" className="text-xs">Religious Facilities</Badge>
                    )}
                    {program.hasHalalFood && (
                      <Badge variant="secondary" className="text-xs">Halal Food</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild className="w-full">
                  <Link to={`/programs/${program.id}`} className="flex items-center justify-center">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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
    </div>
  );
}
