
import { useState } from "react";
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
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Program data
const programs = [
  {
    id: 1,
    name: "Master of Computer Science",
    university: "Stanford University",
    location: "California, USA",
    type: "Masters",
    duration: "2 years",
    tuition: "$57,000/year",
    rating: 4.8,
    deadline: "2023-12-01",
    subjects: ["Computer Science", "Artificial Intelligence", "Machine Learning"],
    applicationFee: "$125",
    featured: true
  },
  {
    id: 2,
    name: "MBA",
    university: "Harvard Business School",
    location: "Massachusetts, USA",
    type: "Masters",
    duration: "2 years",
    tuition: "$73,000/year",
    rating: 4.9,
    deadline: "2023-09-08",
    subjects: ["Business", "Management", "Leadership"],
    applicationFee: "$250",
    featured: true
  },
  {
    id: 3,
    name: "MSc in Data Science",
    university: "MIT",
    location: "Massachusetts, USA",
    type: "Masters",
    duration: "1.5 years",
    tuition: "$53,790/year",
    rating: 4.7,
    deadline: "2023-11-15",
    subjects: ["Data Science", "Statistics", "Machine Learning"],
    applicationFee: "$175",
    featured: true
  },
  {
    id: 4,
    name: "Bachelor of Engineering",
    university: "University of California, Berkeley",
    location: "California, USA",
    type: "Bachelor",
    duration: "4 years",
    tuition: "$43,980/year",
    rating: 4.5,
    deadline: "2023-11-30",
    subjects: ["Engineering", "Computer Science", "Electrical Engineering"],
    applicationFee: "$80",
    featured: false
  },
  {
    id: 5,
    name: "PhD in AI and Machine Learning",
    university: "Carnegie Mellon University",
    location: "Pennsylvania, USA",
    type: "PhD",
    duration: "5 years",
    tuition: "$45,800/year",
    rating: 4.9,
    deadline: "2023-12-15",
    subjects: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
    applicationFee: "$95",
    featured: false
  },
  {
    id: 6,
    name: "MSc in Cybersecurity",
    university: "University of Oxford",
    location: "Oxford, UK",
    type: "Masters",
    duration: "1 year",
    tuition: "£28,900/year",
    rating: 4.6,
    deadline: "2024-01-20",
    subjects: ["Cybersecurity", "Network Security", "Cryptography"],
    applicationFee: "£75",
    featured: false
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
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
      program.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && program.featured) ||
      program.type.toLowerCase() === activeTab.toLowerCase();
    
    // Program type filter
    const matchesType = 
      selectedTypes.length === 0 || 
      selectedTypes.includes(program.type);
    
    // Price filter (simplified for demo, would need actual price extraction in real app)
    // const price = parseInt(program.tuition.replace(/[^0-9]/g, ''));
    // const matchesPrice = price >= priceRange[0] * 1000 && price <= priceRange[1] * 1000;
    
    return matchesSearch && matchesTab && matchesType;
  });

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
              <Button variant="outline" className="w-full">
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
          
          {/* Programs grid */}
          {filteredPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className={program.featured ? "border-primary" : ""}>
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
                      {program.university}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.location}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{program.tuition}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Program Rating</span>
                        <ProgramRating rating={program.rating} />
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {program.subjects.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm mt-3">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Deadline: {new Date(program.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Info className="h-4 w-4 mr-2" />
                          <span>Fee: {program.applicationFee}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex gap-2">
                      <Button variant="default" className="flex-1">
                        Apply Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        More Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
