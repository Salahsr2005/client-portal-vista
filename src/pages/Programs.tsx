
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon, FilterIcon, Search, SortAscIcon, SortDescIcon, Star } from 'lucide-react';
import { mockPrograms, programTypes, algerianWilayas, algerianUniversities, languages, Program } from '@/utils/mockData';

const ProgramsPage = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(mockPrograms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  // Handle type selection
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Handle wilaya selection
  const toggleWilaya = (wilaya: string) => {
    if (selectedWilayas.includes(wilaya)) {
      setSelectedWilayas(selectedWilayas.filter(w => w !== wilaya));
    } else {
      setSelectedWilayas([...selectedWilayas, wilaya]);
    }
  };

  // Handle university selection
  const toggleUniversity = (university: string) => {
    if (selectedUniversities.includes(university)) {
      setSelectedUniversities(selectedUniversities.filter(u => u !== university));
    } else {
      setSelectedUniversities([...selectedUniversities, university]);
    }
  };

  // Handle language selection
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  // Filter and sort programs
  useEffect(() => {
    let result = [...mockPrograms];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(program => 
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Program type filter
    if (selectedTypes.length > 0) {
      result = result.filter(program => selectedTypes.includes(program.type));
    }
    
    // Wilaya filter
    if (selectedWilayas.length > 0) {
      result = result.filter(program => selectedWilayas.includes(program.wilaya));
    }
    
    // University filter
    if (selectedUniversities.length > 0) {
      result = result.filter(program => selectedUniversities.includes(program.university));
    }
    
    // Language filter
    if (selectedLanguages.length > 0) {
      result = result.filter(program => selectedLanguages.includes(program.language));
    }
    
    // Status filter
    if (selectedStatus) {
      result = result.filter(program => program.status === selectedStatus);
    }
    
    // Price range filter
    result = result.filter(program => 
      program.fees >= priceRange[0] && program.fees <= priceRange[1]
    );
    
    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy as keyof Program];
        const bValue = b[sortBy as keyof Program];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    
    setFilteredPrograms(result);
  }, [
    searchTerm, 
    selectedTypes, 
    selectedWilayas, 
    selectedUniversities, 
    selectedLanguages, 
    selectedStatus, 
    priceRange, 
    sortBy, 
    sortOrder
  ]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-green-500';
      case 'Closed': return 'bg-red-500';
      case 'Coming Soon': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Filter sidebar */}
        <div className={`w-full md:w-1/4 lg:w-1/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-4 ${filterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{t('programs.filters')}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden" 
              onClick={() => setFilterOpen(false)}
            >
              {t('common.close')}
            </Button>
          </div>
          
          <Accordion type="multiple" defaultValue={["price", "type", "status"]} className="w-full">
            {/* Price Range Filter */}
            <AccordionItem value="price">
              <AccordionTrigger>{t('programs.priceRange')}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider 
                    defaultValue={[0, 3000]} 
                    max={3000} 
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                  />
                  <div className="flex justify-between">
                    <span>{priceRange[0]} {t('common.currency')}</span>
                    <span>{priceRange[1]} {t('common.currency')}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Program Type Filter */}
            <AccordionItem value="type">
              <AccordionTrigger>{t('programs.type')}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {programTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full justify-start ${
                            selectedTypes.includes(type) ? 'bg-primary/20' : ''
                          }`}
                          onClick={() => toggleType(type)}
                        >
                          {selectedTypes.includes(type) && (
                            <CheckIcon className="mr-2 h-4 w-4" />
                          )}
                          {type}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* Wilaya Filter */}
            <AccordionItem value="wilaya">
              <AccordionTrigger>{t('programs.wilaya')}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {algerianWilayas.map((wilaya) => (
                      <div key={wilaya} className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full justify-start ${
                            selectedWilayas.includes(wilaya) ? 'bg-primary/20' : ''
                          }`}
                          onClick={() => toggleWilaya(wilaya)}
                        >
                          {selectedWilayas.includes(wilaya) && (
                            <CheckIcon className="mr-2 h-4 w-4" />
                          )}
                          {wilaya}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* University Filter */}
            <AccordionItem value="university">
              <AccordionTrigger>{t('programs.university')}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {algerianUniversities.map((university) => (
                      <div key={university} className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full justify-start ${
                            selectedUniversities.includes(university) ? 'bg-primary/20' : ''
                          }`}
                          onClick={() => toggleUniversity(university)}
                        >
                          {selectedUniversities.includes(university) && (
                            <CheckIcon className="mr-2 h-4 w-4" />
                          )}
                          {university}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* Language Filter */}
            <AccordionItem value="language">
              <AccordionTrigger>{t('programs.language')}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${
                          selectedLanguages.includes(language) ? 'bg-primary/20' : ''
                        }`}
                        onClick={() => toggleLanguage(language)}
                      >
                        {selectedLanguages.includes(language) && (
                          <CheckIcon className="mr-2 h-4 w-4" />
                        )}
                        {language}
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Status Filter */}
            <AccordionItem value="status">
              <AccordionTrigger>{t('programs.status')}</AccordionTrigger>
              <AccordionContent>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('programs.selectStatus') as string} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('programs.all')}
                    </SelectItem>
                    <SelectItem value="Open">
                      {t('programs.statusOpen')}
                    </SelectItem>
                    <SelectItem value="Closed">
                      {t('programs.statusClosed')}
                    </SelectItem>
                    <SelectItem value="Coming Soon">
                      {t('programs.statusComingSoon')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-6 space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedTypes([]);
                setSelectedWilayas([]);
                setSelectedUniversities([]);
                setSelectedLanguages([]);
                setSelectedStatus('');
                setPriceRange([0, 3000]);
                setSortBy('');
                setSortOrder('asc');
                setSearchTerm('');
              }}
            >
              {t('common.resetFilters')}
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">{t('programs.title')}</h1>
            
            <Button 
              variant="outline" 
              className="md:hidden w-full"
              onClick={() => setFilterOpen(true)}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              {t('programs.filters')}
            </Button>
          </div>
          
          {/* Search and sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('programs.searchPlaceholder') as string}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('programs.sortBy') as string} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {t('programs.none')}
                  </SelectItem>
                  <SelectItem value="title">
                    {t('programs.sortByTitle')}
                  </SelectItem>
                  <SelectItem value="fees">
                    {t('programs.sortByPrice')}
                  </SelectItem>
                  <SelectItem value="duration">
                    {t('programs.sortByDuration')}
                  </SelectItem>
                  <SelectItem value="startDate">
                    {t('programs.sortByDate')}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                disabled={!sortBy}
              >
                {sortOrder === 'asc' ? (
                  <SortAscIcon className="h-4 w-4" />
                ) : (
                  <SortDescIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedTypes.length > 0 || selectedWilayas.length > 0 || 
            selectedUniversities.length > 0 || selectedLanguages.length > 0 || 
            selectedStatus || priceRange[0] > 0 || priceRange[1] < 3000) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary" className="px-3 py-1">
                    {type}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => toggleType(type)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {selectedWilayas.map(wilaya => (
                  <Badge key={wilaya} variant="secondary" className="px-3 py-1">
                    {wilaya}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => toggleWilaya(wilaya)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {selectedUniversities.map(uni => (
                  <Badge key={uni} variant="secondary" className="px-3 py-1">
                    {uni}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => toggleUniversity(uni)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {selectedLanguages.map(lang => (
                  <Badge key={lang} variant="secondary" className="px-3 py-1">
                    {lang}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => toggleLanguage(lang)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {selectedStatus && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedStatus}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => setSelectedStatus('')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < 3000) && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {priceRange[0]} - {priceRange[1]} {t('common.currency')}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => setPriceRange([0, 3000])}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {t('programs.showing')} {filteredPrograms.length} {t('programs.results')}
            </p>
          </div>
          
          {/* Program cards */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">{t('programs.noResults')}</h3>
              <p className="text-muted-foreground">{t('programs.tryAdjusting')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((program) => (
                <Card key={program.id} className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Badge 
                        className={getStatusColor(program.status)}
                      >
                        {program.status}
                      </Badge>
                      {program.featured && (
                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                          {t('programs.featured')}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 line-clamp-2">{program.title}</CardTitle>
                    <div className="flex items-center">
                      <span className="flex items-center text-yellow-500">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(program.rating) ? 'fill-current' : 'fill-none'}`} 
                          />
                        ))}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {program.rating.toFixed(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <CardDescription className="mb-4 line-clamp-3">
                      {program.description}
                    </CardDescription>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.type')}:</span>
                        <span className="font-medium">{program.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.location')}:</span>
                        <span className="font-medium">{program.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.duration')}:</span>
                        <span className="font-medium">{program.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.fees')}:</span>
                        <span className="font-medium">
                          {program.fees === 0 
                            ? t('programs.free') 
                            : `${program.fees} ${t('common.currency')}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.language')}:</span>
                        <span className="font-medium">{program.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('programs.deadline')}:</span>
                        <span className="font-medium">{program.applicationDeadline}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button className="w-full">{t('programs.details')}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredPrograms.length > 0 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
