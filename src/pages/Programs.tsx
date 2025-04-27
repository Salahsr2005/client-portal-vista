
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  
  // Filter programs based on search, tab, and filters
  const filteredPrograms = programs.filter(program => {
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
    
    return matchesSearch && matchesTab && matchesType;
  });

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
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
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
                  className={`relative overflow-hidden ${program.featured ? "border-primary" : ""}`}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                      backgroundImage: `url(${program.image_url || '/placeholder.svg'})`,
                      zIndex: 0
                    }}
                  />
                  
                  {/* Content overlay */}
                  <div className="relative z-10">
                    {program.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1 fill-primary-foreground" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">{program.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <School className="h-4 w-4 mr-1" />
                        {program.university || "University"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{program.location || "Unknown location"}</span>
                        </div>
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
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Program Rating</span>
                          <ProgramRating rating={program.rating || 4.5} />
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {program.subjects && program.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
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
                      
                      <div className="pt-2 flex gap-2">
                        <Button 
                          variant="default" 
                          className="flex-1"
                          onClick={() => navigate(`/applications/new?programId=${program.id}`)}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/programs/${program.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </div>
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
