import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePrograms } from "@/hooks/usePrograms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  CircleDollarSign, 
  Languages,
  CheckCircle,
  ChevronDown,
  Building,
  Star,
  Clock3
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

interface FilterState {
  search: string;
  studyLevel: string;
  country: string;
  field: string;
  language: string;
  tuitionRange: [number, number];
  duration: string;
  scholarshipAvailable: boolean;
  internshipOpportunities: boolean;
}

export default function Programs() {
  const navigate = useNavigate();
  const { data: programs, isLoading, error } = usePrograms();
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    studyLevel: "Any",
    country: "Any",
    field: "Any",
    language: "Any",
    tuitionRange: [0, 50000],
    duration: "Any",
    scholarshipAvailable: false,
    internshipOpportunities: false,
  });

  const sortPrograms = (programs, sortOption) => {
    const programsCopy = [...programs];

    switch (sortOption) {
      case "name-asc":
        return programsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return programsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "tuition-asc":
        return programsCopy.sort((a, b) => Number(a.tuition_min) - Number(b.tuition_min));
      case "tuition-desc":
        return programsCopy.sort((a, b) => Number(b.tuition_min) - Number(a.tuition_min));
      case "duration-asc":
        return programsCopy.sort((a, b) => Number(a.duration_months) - Number(b.duration_months));
      case "duration-desc":
        return programsCopy.sort((a, b) => Number(b.duration_months) - Number(a.duration_months));
      case "ranking-asc":
        return programsCopy.sort((a, b) => {
          if (!a.ranking) return 1;
          if (!b.ranking) return -1;
          return Number(a.ranking) - Number(b.ranking);
        });
      case "ranking-desc":
        return programsCopy.sort((a, b) => {
          if (!a.ranking) return 1;
          if (!b.ranking) return -1;
          return Number(b.ranking) - Number(a.ranking);
        });
      default:
        return programsCopy;
    }
  };

  // Extract unique values for filter dropdowns
  const countries = programs
    ? ["Any", ...Array.from(new Set(programs.map((p) => p.country)))]
    : ["Any"];
  
  const studyLevels = programs
    ? ["Any", ...Array.from(new Set(programs.map((p) => String(p.study_level))))]
    : ["Any"];
  
  const fields = programs
    ? ["Any", ...Array.from(new Set(programs.map((p) => p.field as string)))]
    : ["Any"];
  
  const languages = programs
    ? ["Any", ...Array.from(new Set(programs.map((p) => p.program_language)))]
    : ["Any"];
  
  const durations = ["Any", "Short (<12 months)", "Medium (12-24 months)", "Long (>24 months)"];

  const applyFilters = () => {
    if (!programs) return;

    const filtered = programs.filter((program) => {
      // Search filter
      const searchMatch =
        filters.search === "" ||
        program.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        program.university.toLowerCase().includes(filters.search.toLowerCase()) ||
        program.country.toLowerCase().includes(filters.search.toLowerCase());

      // Study level filter
      const studyLevelMatch =
        filters.studyLevel === "Any" ||
        String(program.study_level) === filters.studyLevel;

      // Country filter
      const countryMatch =
        filters.country === "Any" || program.country === filters.country;

      // Field filter
      const fieldMatch =
        filters.field === "Any" || program.field === filters.field;

      // Language filter
      const languageMatch =
        filters.language === "Any" || program.program_language === filters.language;

      // Tuition range filter
      const tuitionMatch =
        program.tuition_min >= filters.tuitionRange[0] &&
        program.tuition_min <= filters.tuitionRange[1];

      // Duration filter
      let durationMatch = true;
      if (filters.duration === "Short (<12 months)") {
        durationMatch = program.duration_months < 12;
      } else if (filters.duration === "Medium (12-24 months)") {
        durationMatch = program.duration_months >= 12 && program.duration_months <= 24;
      } else if (filters.duration === "Long (>24 months)") {
        durationMatch = program.duration_months > 24;
      }

      // Scholarship filter
      const scholarshipMatch = !filters.scholarshipAvailable || program.scholarship_available;

      // Internship filter
      const internshipMatch = !filters.internshipOpportunities || program.internship_opportunities;

      return (
        searchMatch &&
        studyLevelMatch &&
        countryMatch &&
        fieldMatch &&
        languageMatch &&
        tuitionMatch &&
        durationMatch &&
        scholarshipMatch &&
        internshipMatch
      );
    });

    setFilteredPrograms(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [programs, filters]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean | [number, number]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      studyLevel: "Any",
      country: "Any",
      field: "Any",
      language: "Any",
      tuitionRange: [0, 50000],
      duration: "Any",
      scholarshipAvailable: false,
      internshipOpportunities: false,
    });
  };

  const renderFilterCount = () => {
    let count = 0;
    if (filters.studyLevel !== "Any") count++;
    if (filters.country !== "Any") count++;
    if (filters.field !== "Any") count++;
    if (filters.language !== "Any") count++;
    if (filters.duration !== "Any") count++;
    if (filters.scholarshipAvailable) count++;
    if (filters.internshipOpportunities) count++;
    if (filters.tuitionRange[0] > 0 || filters.tuitionRange[1] < 50000) count++;
    return count > 0 ? count : "";
  };

  const renderHighlightBadge = (value: string | number) => {
    // Convert to number if it's not already
    const numericValue = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(numericValue)) return null;

    if (numericValue > 90) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    } else if (numericValue > 70) {
      return <Badge className="bg-blue-100 text-blue-700">Good</Badge>;
    }
    return null;
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Programs</h1>
            <p className="text-muted-foreground">
              Discover the perfect educational program for your future
            </p>
          </div>

          <Button asChild className="mt-4 md:mt-0">
            <Link to="/consultation">
              <BookOpen className="mr-2 h-4 w-4" />
              Program Finder
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr] gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs, universities, or locations..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {renderFilterCount() && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                    {renderFilterCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Programs</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Study Level</h3>
                  <Select
                    value={filters.studyLevel}
                    onValueChange={(value) => handleFilterChange("studyLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select study level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {studyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Country</h3>
                  <Select
                    value={filters.country}
                    onValueChange={(value) => handleFilterChange("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Field of Study</h3>
                  <Select
                    value={filters.field}
                    onValueChange={(value) => handleFilterChange("field", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fields.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Language</h3>
                  <Select
                    value={filters.language}
                    onValueChange={(value) => handleFilterChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Duration</h3>
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => handleFilterChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Tuition Range ($)</h3>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={50000}
                      step={1000}
                      value={filters.tuitionRange}
                      onValueChange={(value) => handleFilterChange("tuitionRange", value as [number, number])}
                      className="my-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${filters.tuitionRange[0].toLocaleString()}</span>
                      <span>${filters.tuitionRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-sm font-medium">Additional Options</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scholarship"
                      checked={filters.scholarshipAvailable}
                      onCheckedChange={(checked) => handleFilterChange("scholarshipAvailable", Boolean(checked))}
                    />
                    <Label htmlFor="scholarship">Scholarship Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internship"
                      checked={filters.internshipOpportunities}
                      onCheckedChange={(checked) => handleFilterChange("internshipOpportunities", Boolean(checked))}
                    />
                    <Label htmlFor="internship">Internship Opportunities</Label>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {filteredPrograms?.length || 0} programs found
          </div>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="tuition-asc">Tuition: Low to High</SelectItem>
              <SelectItem value="tuition-desc">Tuition: High to Low</SelectItem>
              <SelectItem value="duration-asc">Duration: Shortest</SelectItem>
              <SelectItem value="duration-desc">Duration: Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters display */}
        {renderFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.studyLevel !== "Any" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {filters.studyLevel}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("studyLevel", "Any")}
                >
                  &times;
                </button>
              </Badge>
            )}
            {filters.country !== "Any" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {filters.country}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("country", "Any")}
                >
                  &times;
                </button>
              </Badge>
            )}
            {filters.field !== "Any" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {filters.field}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("field", "Any")}
                >
                  &times;
                </button>
              </Badge>
            )}
            {filters.language !== "Any" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {filters.language}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("language", "Any")}
                >
                  &times;
                </button>
              </Badge>
            )}
            {filters.duration !== "Any" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {filters.duration}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("duration", "Any")}
                >
                  &times;
                </button>
              </Badge>
            )}
            {(filters.scholarshipAvailable || filters.internshipOpportunities) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.scholarshipAvailable ? "Scholarship" : "Internship"}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange(
                    filters.scholarshipAvailable ? "scholarshipAvailable" : "internshipOpportunities", 
                    false
                  )}
                >
                  &times;
                </button>
              </Badge>
            )}
            {(filters.tuitionRange[0] > 0 || filters.tuitionRange[1] < 50000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CircleDollarSign className="h-3 w-3" />
                ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("tuitionRange", [0, 50000])}
                >
                  &times;
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-destructive text-lg mb-2">Error loading programs</div>
          <p className="text-muted-foreground">
            There was a problem fetching the programs data.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="text-xl font-medium mb-1">No matching programs</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to find more programs.
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramCard({ program }: { program: any }) {
  const navigate = useNavigate();
  const programImageUrl = program.image_url || "/placeholder.svg?height=200&width=400&text=Program%20Image";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer group" 
      onClick={() => navigate(`/programs/${program.id}`)}>
      <div className="aspect-video w-full relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300" 
          style={{ backgroundImage: `url(${programImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-4">
          <Badge className="mb-2">{program.study_level}</Badge>
          <h3 className="font-semibold text-white text-lg line-clamp-1">{program.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <Building className="h-3.5 w-3.5 mr-1" />
            <span className="line-clamp-1">{program.university}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span className="text-sm">{program.country}</span>
          </div>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-amber-500 mr-1" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div className="flex items-center">
            <Clock3 className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span>{program.duration} months</span>
          </div>
          <div className="flex items-center">
            <Languages className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span>{program.program_language}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span>Deadline: {program.deadline}</span>
          </div>
          <div className="flex items-center">
            <CircleDollarSign className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span>${program.tuition}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {program.scholarship_available && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                Scholarship
              </Badge>
            )}
            {program.internship_opportunities && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                Internship
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
            Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function CircleDashed(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M17.57 17.57 12 12" />
      <path d="m12 12-5.57-5.57" />
      <path d="m12 12-5.57 5.57" />
      <path d="m12 12 5.57-5.57" />
    </svg>
  );
}
