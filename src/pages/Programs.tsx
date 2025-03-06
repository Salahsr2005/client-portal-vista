
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
  X, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  CreditCard, 
  GlobeIcon, 
  Calendar,
  ArrowDown,
  ArrowUp,
  ArrowDownAZ,
  ArrowUpAZ
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

// Import mock data and helper functions
import { programData } from "@/utils/mockData";

export default function Programs() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    countries: [],
    levels: [],
    fields: [],
    languages: [],
    duration: [0, 60],
    tuition: [0, 100000]
  });
  const [sortOption, setSortOption] = useState("relevance");
  const [activeTab, setActiveTab] = useState("grid");
  const [filteredPrograms, setFilteredPrograms] = useState(programData);
  const [isFilteringActive, setIsFilteringActive] = useState(false);
  
  // Filter options from the programData
  const countryOptions = [...new Set(programData.map(p => p.country))].sort();
  const levelOptions = [...new Set(programData.map(p => p.level))].sort();
  const fieldOptions = [...new Set(programData.map(p => p.field))].sort();
  const languageOptions = [...new Set(programData.map(p => p.language))].sort();
  
  // Filter and sort programs when filters or sort option changes
  useEffect(() => {
    let result = [...programData];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(
        program => 
          program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.countries.length > 0) {
      result = result.filter(program => filters.countries.includes(program.country));
    }
    
    if (filters.levels.length > 0) {
      result = result.filter(program => filters.levels.includes(program.level));
    }
    
    if (filters.fields.length > 0) {
      result = result.filter(program => filters.fields.includes(program.field));
    }
    
    if (filters.languages.length > 0) {
      result = result.filter(program => filters.languages.includes(program.language));
    }
    
    result = result.filter(
      program => 
        program.durationMonths >= filters.duration[0] && 
        program.durationMonths <= filters.duration[1]
    );
    
    result = result.filter(
      program => 
        program.tuitionPerYear >= filters.tuition[0] && 
        program.tuitionPerYear <= filters.tuition[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case "nameAsc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "dateNewest":
        result.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
        break;
      case "dateOldest":
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case "tuitionLow":
        result.sort((a, b) => a.tuitionPerYear - b.tuitionPerYear);
        break;
      case "tuitionHigh":
        result.sort((a, b) => b.tuitionPerYear - a.tuitionPerYear);
        break;
      default:
        // "relevance" is the default, no sorting needed
        break;
    }
    
    setFilteredPrograms(result);
    
    // Check if any filter is active
    const isActive = 
      searchTerm !== "" || 
      filters.countries.length > 0 || 
      filters.levels.length > 0 || 
      filters.fields.length > 0 || 
      filters.languages.length > 0 || 
      filters.duration[0] > 0 || 
      filters.duration[1] < 60 || 
      filters.tuition[0] > 0 || 
      filters.tuition[1] < 100000;
      
    setIsFilteringActive(isActive);
  }, [searchTerm, filters, sortOption]);
  
  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (Array.isArray(newFilters[type])) {
        if (newFilters[type].includes(value)) {
          newFilters[type] = newFilters[type].filter(item => item !== value);
        } else {
          newFilters[type] = [...newFilters[type], value];
        }
      } else {
        newFilters[type] = value;
      }
      
      return newFilters;
    });
  };
  
  const resetFilters = () => {
    setFilters({
      countries: [],
      levels: [],
      fields: [],
      languages: [],
      duration: [0, 60],
      tuition: [0, 100000]
    });
    setSearchTerm("");
    setSortOption("relevance");
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSortIcon = () => {
    switch (sortOption) {
      case "nameAsc":
        return <ArrowDownAZ className="ml-2 h-4 w-4" />;
      case "nameDesc":
        return <ArrowUpAZ className="ml-2 h-4 w-4" />;
      case "tuitionLow":
        return <ArrowDown className="ml-2 h-4 w-4" />;
      case "tuitionHigh":
        return <ArrowUp className="ml-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("programs.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("programs.subtitle")}
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("programs.filters.search")}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className={`h-4 w-4 ${isFilteringActive ? "text-primary" : ""}`} />
                  {t("programs.filters.filter")}
                  {isFilteringActive && (
                    <Badge variant="default" className="ml-1">
                      {Object.values(filters).flat().filter(v => typeof v !== 'number').length + 
                        (filters.duration[0] > 0 || filters.duration[1] < 60 ? 1 : 0) + 
                        (filters.tuition[0] > 0 || filters.tuition[1] < 100000 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t("programs.filters.title")}</h3>
                    {isFilteringActive && (
                      <Button variant="ghost" size="sm" onClick={resetFilters}>
                        {t("programs.filters.reset")}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
                  {/* Country Filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t("programs.filters.country")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {countryOptions.map(country => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`country-${country}`} 
                            checked={filters.countries.includes(country)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('countries', country);
                              } else {
                                handleFilterChange('countries', country);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`country-${country}`}
                            className="text-sm cursor-pointer"
                          >
                            {country}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Level Filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t("programs.filters.level")}</h4>
                    <div className="space-y-2">
                      {levelOptions.map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`level-${level}`} 
                            checked={filters.levels.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('levels', level);
                              } else {
                                handleFilterChange('levels', level);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`level-${level}`}
                            className="text-sm cursor-pointer"
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Field of Study Filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t("programs.filters.field")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {fieldOptions.map(field => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`field-${field}`} 
                            checked={filters.fields.includes(field)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('fields', field);
                              } else {
                                handleFilterChange('fields', field);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`field-${field}`}
                            className="text-sm cursor-pointer truncate"
                          >
                            {field}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Duration Filter */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{t("programs.filters.duration")}</h4>
                      <span className="text-sm text-muted-foreground">
                        {filters.duration[0]} - {filters.duration[1]} {t("months")}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 60]}
                      min={0}
                      max={60}
                      step={6}
                      value={filters.duration}
                      onValueChange={(value) => handleFilterChange('duration', value)}
                    />
                  </div>
                  
                  {/* Language Filter */}
                  <div>
                    <h4 className="font-medium mb-2">{t("programs.filters.language")}</h4>
                    <div className="space-y-2">
                      {languageOptions.map(language => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`language-${language}`} 
                            checked={filters.languages.includes(language)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('languages', language);
                              } else {
                                handleFilterChange('languages', language);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`language-${language}`}
                            className="text-sm cursor-pointer"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tuition Fee Filter */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{t("programs.filters.tuition")}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(filters.tuition[0])} - {formatCurrency(filters.tuition[1])}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 100000]}
                      min={0}
                      max={100000}
                      step={5000}
                      value={filters.tuition}
                      onValueChange={(value) => handleFilterChange('tuition', value)}
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <Button 
                    className="w-full"
                    onClick={() => document.querySelector('[data-radix-popper-content-wrapper]')?.remove()}
                  >
                    {t("programs.filters.apply")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <span>{t("programs.filters.sort")}</span>
                  {getSortIcon()}
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("programs.filters.sortOptions.relevance")}</SelectItem>
                <SelectItem value="nameAsc">{t("programs.filters.sortOptions.nameAsc")}</SelectItem>
                <SelectItem value="nameDesc">{t("programs.filters.sortOptions.nameDesc")}</SelectItem>
                <SelectItem value="dateNewest">{t("programs.filters.sortOptions.dateNewest")}</SelectItem>
                <SelectItem value="dateOldest">{t("programs.filters.sortOptions.dateOldest")}</SelectItem>
                <SelectItem value="tuitionLow">{t("programs.filters.sortOptions.tuitionLow")}</SelectItem>
                <SelectItem value="tuitionHigh">{t("programs.filters.sortOptions.tuitionHigh")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <div className="flex flex-col gap-0.5 h-4 w-4 justify-center">
                    <div className="h-0.5 bg-current rounded-sm"></div>
                    <div className="h-0.5 bg-current rounded-sm"></div>
                    <div className="h-0.5 bg-current rounded-sm"></div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {isFilteringActive && (
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.countries.map(country => (
              <Badge key={`badge-country-${country}`} variant="secondary" className="flex items-center gap-1">
                {country}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('countries', country)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.levels.map(level => (
              <Badge key={`badge-level-${level}`} variant="secondary" className="flex items-center gap-1">
                {level}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('levels', level)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.fields.map(field => (
              <Badge key={`badge-field-${field}`} variant="secondary" className="flex items-center gap-1">
                {field}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('fields', field)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.languages.map(language => (
              <Badge key={`badge-language-${language}`} variant="secondary" className="flex items-center gap-1">
                {language}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('languages', language)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {(filters.duration[0] > 0 || filters.duration[1] < 60) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.duration[0]}-{filters.duration[1]} {t("months")}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('duration', [0, 60])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(filters.tuition[0] > 0 || filters.tuition[1] < 100000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {formatCurrency(filters.tuition[0])}-{formatCurrency(filters.tuition[1])}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange('tuition', [0, 100000])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {isFilteringActive && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6"
                onClick={resetFilters}
              >
                {t("programs.filters.reset")}
              </Button>
            )}
          </div>
        )}
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredPrograms.length} {filteredPrograms.length === 1 ? "program" : "programs"} found
          </p>
        </div>
        
        {/* Programs Grid/List View */}
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="relative p-0 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white text-black">{program.country}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">{program.title}</h3>
                      <p className="text-white/80 text-sm">{program.university}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{program.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{program.durationMonths} {t("months")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{formatCurrency(program.tuitionPerYear)}/year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{program.language}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t("programs.card.deadline")}: {new Date(program.deadline).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t("programs.card.details")}
                  </Button>
                  <Button size="sm" className="flex-1">
                    {t("programs.card.apply")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-black">{program.country}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-1">{program.title}</h3>
                      <p className="text-muted-foreground">{program.university}</p>
                    </div>
                    
                    <p className="mb-4 line-clamp-2">{program.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{program.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{program.durationMonths} {t("months")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{formatCurrency(program.tuitionPerYear)}/year</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{program.language}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{t("programs.card.deadline")}: {new Date(program.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {t("programs.card.details")}
                        </Button>
                        <Button size="sm">
                          {t("programs.card.apply")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* No results message */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No programs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
            <Button onClick={resetFilters}>Reset all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
