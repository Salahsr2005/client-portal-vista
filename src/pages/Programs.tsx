
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  Search, 
  GraduationCap, 
  MapPin, 
  Filter, 
  ArrowUpDown, 
  Star, 
  StarHalf,
  School,
  Clock,
  BookText,
  Info,
  DollarSign,
  Calendar,
  Loader,
  Share2,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrograms } from "@/hooks/usePrograms";
import { useToast } from "@/hooks/use-toast";

// Display program rating stars
const ProgramRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-muted-foreground" />
      ))}
      <span className="text-sm font-medium ml-1">{rating}</span>
    </div>
  );
};

export default function Programs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { data: programs = [], isLoading, error } = usePrograms();
  const { toast } = useToast();
  
  // Handle program type filter
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Handle country filter
  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };
  
  // Extract unique countries from programs
  const countries = Array.from(new Set(programs.map(program => program.location)));
  
  // Handle sorting change
  const handleSortChange = (value: string) => {
    if (value === sortBy) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortDirection("asc");
    }
  };
  
  // Share program
  const shareProgram = (program) => {
    const url = `${window.location.origin}/programs/${program.id}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "Program link has been copied to clipboard",
        });
      }).catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Copy not supported",
        description: "Your browser doesn't support clipboard copying",
        variant: "destructive",
      });
    }
  };
  
  // Filter programs based on search, tab, and filters
  let filteredPrograms = programs.filter(program => {
    // Search filter
    const matchesSearch = 
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (program.university && program.university.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (program.subjects && program.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && program.featured) ||
      (program.type && program.type.toLowerCase() === activeTab.toLowerCase());
    
    // Program type filter
    const matchesType = 
      selectedTypes.length === 0 || 
      (program.type && selectedTypes.includes(program.type));
    
    // Country filter
    const matchesCountry = 
      selectedCountries.length === 0 || 
      (program.location && selectedCountries.includes(program.location));
    
    // Price filter - assuming the tuition is a string like "$15000"
    let tuitionValue = 0;
    if (program.tuition) {
      const match = program.tuition.match(/\d+/);
      if (match) {
        tuitionValue = parseInt(match[0]);
      }
    }
    
    const matchesPrice = tuitionValue >= priceRange[0] * 1000 && tuitionValue <= priceRange[1] * 1000;
    
    return matchesSearch && matchesTab && matchesType && matchesCountry && matchesPrice;
  });
  
  // Apply sorting
  filteredPrograms = [...filteredPrograms].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case "tuition":
        valueA = extractNumber(a.tuition) || 0;
        valueB = extractNumber(b.tuition) || 0;
        break;
      case "duration":
        valueA = extractNumber(a.duration) || 0;
        valueB = extractNumber(b.duration) || 0;
        break;
      case "rating":
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  // Helper to extract numbers from strings
  function extractNumber(str: string): number | null {
    if (!str) return null;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load programs. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Program Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bachelor" 
                    checked={selectedTypes.includes("Bachelor")}
                    onCheckedChange={() => handleTypeChange("Bachelor")}
                  />
                  <label htmlFor="bachelor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Bachelor's Degree
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="masters" 
                    checked={selectedTypes.includes("Masters")}
                    onCheckedChange={() => handleTypeChange("Masters")}
                  />
                  <label htmlFor="masters" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Master's Degree
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="phd" 
                    checked={selectedTypes.includes("PhD")}
                    onCheckedChange={() => handleTypeChange("PhD")}
                  />
                  <label htmlFor="phd" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    PhD/Doctorate
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Country</h3>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {countries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`country-${country}`} 
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={() => handleCountryChange(country)}
                    />
                    <label htmlFor={`country-${country}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {country}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Tuition Range</h3>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]}k-${priceRange[1]}k/year
                </span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={100}
                step={5}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Application Deadline</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  Next Month
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  Next 3 Months
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs" disabled>
                  <Calendar className="mr-1 h-3 w-3" />
                  Next 6 Months
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs" disabled>
                  <Calendar className="mr-1 h-3 w-3" />
                  Custom Date
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={() => {
                setSelectedTypes([]);
                setSelectedCountries([]);
                setPriceRange([0, 100]);
              }}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Programs list */}
        <div className="md:col-span-3 space-y-6">
          {/* Search and sort */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search programs, universities, subjects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="tuition">Tuition</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="masters">Masters</TabsTrigger>
                  <TabsTrigger value="bachelor">Bachelors</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading programs...</span>
            </div>
          )}
          
          {/* Programs grid */}
          {!isLoading && filteredPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPrograms.map((program) => (
                <Card 
                  key={program.id} 
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${program.featured ? "border-primary" : ""}`}
                >
                  {program.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-violet-600">
                        <Star className="h-3 w-3 mr-1 fill-primary-foreground" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  {/* Program image */}
                  <div className="relative h-48 w-full bg-gradient-to-r from-primary/10 to-violet-600/10 overflow-hidden">
                    {program.image_url ? (
                      <img 
                        src={program.image_url} 
                        alt={program.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <School className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    
                    {/* University logo overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center bg-background/80 backdrop-blur-sm p-1.5 rounded-full">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                        <School className="h-5 w-5 text-primary" />
                      </div>
                      <span className="ml-2 font-medium text-sm pr-2">{program.university}</span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{program.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {program.location || "Unknown location"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pb-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.type || "Various"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.duration || "Varies"}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.tuition || "Varies"}</span>
                      </div>
                      <div className="flex items-center">
                        <BookText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate">{program.subjects?.[0] || "Various"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Program Rating</span>
                        <ProgramRating rating={program.rating || 4.5} />
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {program.subjects && program.subjects.slice(0, 3).map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {program.subjects && program.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{program.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm mt-3">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Deadline: {program.deadline ? new Date(program.deadline).toLocaleDateString() : "Contact for details"}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Info className="h-4 w-4 mr-2" />
                          <span>Fee: {program.applicationFee || "Varies"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 gap-2 flex-wrap">
                    <Button 
                      variant="default" 
                      className="flex-1 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
                      onClick={() => navigate(`/applications/new?program=${program.id}`)}
                    >
                      Apply Now
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => shareProgram(program)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        asChild
                        className="flex items-center gap-1"
                      >
                        <Link to={`/programs/${program.id}`}>
                          <span className="hidden sm:inline">Details</span>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : !isLoading ? (
            <Card className="py-12">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">No programs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  {searchQuery 
                    ? "No programs match your search criteria. Try adjusting your filters or search term." 
                    : "No programs available at the moment. Check back later or adjust your filters."}
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedTypes([]);
                  setSelectedCountries([]);
                  setPriceRange([0, 100]);
                  setActiveTab("all");
                }}>
                  Reset All Filters
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
