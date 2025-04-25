import { useState } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  School,
  MapPin,
  DollarSign,
  Calendar,
  GraduationCap,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePrograms } from "@/hooks/usePrograms";
import { useNavigate } from "react-router-dom";

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { data: programs = [], isLoading } = usePrograms();
  const navigate = useNavigate();
  
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
      
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search programs, universities, locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map(type => (
              <Badge
                key={type}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleTypeChange(type)}
              >
                {type}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden h-[400px]">
              <div className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardHeader>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-5/6 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={program.image_url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f"}
                  alt={program.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {program.scholarship_available && (
                  <Badge className="absolute top-4 left-4">
                    Scholarship Available
                  </Badge>
                )}
              </div>

              <CardHeader className="relative z-10">
                <CardTitle className="text-xl line-clamp-1">{program.name}</CardTitle>
                <div className="flex items-center text-muted-foreground text-sm">
                  <School className="h-4 w-4 mr-1" />
                  {program.university}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{program.study_level}</Badge>
                  <Badge variant="outline">{program.duration_months} months</Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{program.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>From ${program.tuition_min?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{program.field}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{program.application_deadline || "Ongoing"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={() => navigate(`/programs/${program.id}`)}>
                    View Details
                  </Button>
                  <Button onClick={() => navigate(`/applications/new?program=${program.id}`)}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <School className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No programs found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {searchQuery 
                ? "No programs match your search criteria. Try adjusting your filters or search term." 
                : "No programs available at the moment."}
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedTypes([]);
              setActiveTab("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
