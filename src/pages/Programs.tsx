import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Filter, GraduationCap, Building, MapPin, Languages, Clock, CircleDollarSign, Heart, BookOpen, ArrowRight, ChevronDown, ChevronUp, Star, StarHalf, Info, AlertCircle, CheckCircle } from 'lucide-react';

export default function Programs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studyLevel: [],
    country: [],
    language: [],
    duration: '',
    tuitionMin: '',
    tuitionMax: '',
    scholarshipAvailable: false,
    internshipOpportunities: false,
  });
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [favoritePrograms, setFavorites] = useState([]);
  const [showFavoritesDialog, setShowFavoritesDialog] = useState(false);
  const [programToRemove, setProgramToRemove] = useState(null);
  
  // First, let's create a table for favorite programs if it doesn't exist:
  const createFavoritesTable = async () => {
    try {
      // Check if the favorite_programs table exists
      const { error } = await supabase
        .from('favorite_programs')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('relation "favorite_programs" does not exist')) {
        // Create the table since it doesn't exist
        const { error: createError } = await supabase
          .rpc('create_favorite_programs_table');
        
        if (createError) {
          console.error('Error creating favorites table:', createError);
        }
      }
    } catch (err) {
      console.error('Error checking favorite programs table:', err);
    }
  };

  useEffect(() => {
    createFavoritesTable();
  }, []);

  useEffect(() => {
    const level = searchParams.get('level');
    const country = searchParams.get('country');
    const field = searchParams.get('field');
    
    if (level || country || field) {
      setFilters(prev => ({
        ...prev,
        studyLevel: level ? [level] : [],
        country: country ? [country] : [],
        field: field || '',
      }));
    }
  }, [searchParams]);
  
  useEffect(() => {
    fetchPrograms();
    if (user) {
      loadFavorites();
    }
  }, [user]);
  
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      toast({
        title: 'Error',
        description: 'Failed to load programs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      // First check if the table exists
      const { error: checkError } = await supabase
        .from('favorite_programs')
        .select('*')
        .limit(1);
      
      if (checkError && checkError.message.includes('relation "favorite_programs" does not exist')) {
        // Create the table
        await createFavoritesTable();
        return; // Return as there are no favorites yet
      }
      
      // Now get the favorites
      const { data, error } = await supabase
        .from('favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      if (!data) return;
      
      const favoriteIds = data.map(item => item.program_id);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };
  
  const toggleFavorite = async (program: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to favorite programs",
        variant: "default",
      });
      navigate("/login");
      return;
    }

    try {
      // Get current favorite status
      const { data: existingFavorite, error: fetchError } = await supabase
        .from('favorite_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('program_id', program.id)
        .maybeSingle();

      if (fetchError && !fetchError.message.includes('relation "favorite_programs" does not exist')) {
        throw fetchError;
      }

      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', program.id);

        if (deleteError) throw deleteError;

        setFavorites(favorites.filter(id => id !== program.id));
        toast({
          title: "Removed from favorites",
          description: `${program.name} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorite_programs')
          .insert({
            user_id: user.id,
            program_id: program.id
          });

        if (insertError) throw insertError;

        setFavorites([...favorites, program.id]);
        toast({
          title: "Added to favorites",
          description: `${program.name} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const removeFavorite = async () => {
    if (!programToRemove) return;
    
    try {
      const { error } = await supabase
        .from('favorite_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programToRemove);
        
      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== programToRemove));
      setProgramToRemove(null);
      setShowFavoritesDialog(false);
      
      toast({
        title: "Program Removed",
        description: "Program removed from your favorites",
      });
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleCheckboxChange = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleMultiSelectChange = (key, value) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [key]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentValues, value]
        };
      }
    });
  };
  
  const resetFilters = () => {
    setFilters({
      studyLevel: [],
      country: [],
      language: [],
      duration: '',
      tuitionMin: '',
      tuitionMax: '',
      scholarshipAvailable: false,
      internshipOpportunities: false,
    });
    setSearchTerm('');
  };
  
  const filteredPrograms = programs.filter(program => {
    if (searchTerm && !program.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !program.university.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.studyLevel.length > 0 && !filters.studyLevel.includes(program.study_level)) {
      return false;
    }
    
    if (filters.country.length > 0 && !filters.country.includes(program.country)) {
      return false;
    }
    
    if (filters.language.length > 0 && !filters.language.includes(program.program_language)) {
      return false;
    }
    
    if (filters.duration) {
      const durationMonths = parseInt(program.duration_months);
      
      switch (filters.duration) {
        case 'short':
          if (durationMonths > 12) return false;
          break;
        case 'medium':
          if (durationMonths < 12 || durationMonths > 24) return false;
          break;
        case 'long':
          if (durationMonths < 24) return false;
          break;
      }
    }
    
    if (filters.tuitionMin && Number(program.tuition_min) < parseInt(filters.tuitionMin)) {
      return false;
    }
    
    if (filters.tuitionMax && Number(program.tuition_min) > parseInt(filters.tuitionMax)) {
      return false;
    }
    
    if (filters.scholarshipAvailable && !program.scholarship_available) {
      return false;
    }
    
    if (filters.internshipOpportunities && !program.internship_opportunities) {
      return false;
    }
    
    return true;
  });
  
  const uniqueCountries = [...new Set(programs.map(program => program.country))].sort();
  const uniqueLanguages = [...new Set(programs.map(program => program.program_language))].sort();
  const uniqueStudyLevels = [...new Set(programs.map(program => program.study_level))].sort();
  
  const handleApplyNow = (programId) => {
    navigate(`/applications/new?program=${programId}`);
  };
  
  const handleViewDetails = (programId) => {
    navigate(`/programs/${programId}`);
  };
  
  const toggleExpandProgram = (programId) => {
    if (expandedProgram === programId) {
      setExpandedProgram(null);
    } else {
      setExpandedProgram(programId);
    }
  };
  
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Programs</h1>
        <p className="text-muted-foreground">
          Discover educational opportunities around the world
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Refine your search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Study Level</h3>
                <div className="space-y-2">
                  {uniqueStudyLevels.map(level => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`level-${level}`} 
                        checked={filters.studyLevel.includes(level)}
                        onCheckedChange={() => handleMultiSelectChange('studyLevel', level)}
                      />
                      <Label htmlFor={`level-${level}`} className="ml-2 text-sm">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Country</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {uniqueCountries.map(country => (
                    <div key={country} className="flex items-center">
                      <Checkbox 
                        id={`country-${country}`} 
                        checked={filters.country.includes(country)}
                        onCheckedChange={() => handleMultiSelectChange('country', country)}
                      />
                      <Label htmlFor={`country-${country}`} className="ml-2 text-sm">
                        {country}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <div className="space-y-2">
                  {uniqueLanguages.map(language => (
                    <div key={language} className="flex items-center">
                      <Checkbox 
                        id={`language-${language}`} 
                        checked={filters.language.includes(language)}
                        onCheckedChange={() => handleMultiSelectChange('language', language)}
                      />
                      <Label htmlFor={`language-${language}`} className="ml-2 text-sm">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Duration</h3>
                <Select 
                  value={filters.duration} 
                  onValueChange={(value) => handleFilterChange('duration', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any duration</SelectItem>
                    <SelectItem value="short">Short (≤ 12 months)</SelectItem>
                    <SelectItem value="medium">Medium (1-2 years)</SelectItem>
                    <SelectItem value="long">Long ({'>'}2 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Tuition (per year)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="tuition-min" className="text-xs">Min ($)</Label>
                    <Input 
                      id="tuition-min" 
                      type="number" 
                      placeholder="0" 
                      value={filters.tuitionMin}
                      onChange={(e) => handleFilterChange('tuitionMin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tuition-max" className="text-xs">Max ($)</Label>
                    <Input 
                      id="tuition-max" 
                      type="number" 
                      placeholder="50000" 
                      value={filters.tuitionMax}
                      onChange={(e) => handleFilterChange('tuitionMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="scholarship" 
                    checked={filters.scholarshipAvailable}
                    onCheckedChange={() => handleCheckboxChange('scholarshipAvailable')}
                  />
                  <Label htmlFor="scholarship" className="ml-2 text-sm">
                    Scholarship Available
                  </Label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="internship" 
                    checked={filters.internshipOpportunities}
                    onCheckedChange={() => handleCheckboxChange('internshipOpportunities')}
                  />
                  <Label htmlFor="internship" className="ml-2 text-sm">
                    Internship Opportunities
                  </Label>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs or universities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your program search
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-medium mb-2">Study Level</h3>
                    <div className="space-y-2">
                      {uniqueStudyLevels.map(level => (
                        <div key={level} className="flex items-center">
                          <Checkbox 
                            id={`mobile-level-${level}`} 
                            checked={filters.studyLevel.includes(level)}
                            onCheckedChange={() => handleMultiSelectChange('studyLevel', level)}
                          />
                          <Label htmlFor={`mobile-level-${level}`} className="ml-2 text-sm">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Country</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {uniqueCountries.map(country => (
                        <div key={country} className="flex items-center">
                          <Checkbox 
                            id={`mobile-country-${country}`} 
                            checked={filters.country.includes(country)}
                            onCheckedChange={() => handleMultiSelectChange('country', country)}
                          />
                          <Label htmlFor={`mobile-country-${country}`} className="ml-2 text-sm">
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Language</h3>
                    <div className="space-y-2">
                      {uniqueLanguages.map(language => (
                        <div key={language} className="flex items-center">
                          <Checkbox 
                            id={`mobile-language-${language}`} 
                            checked={filters.language.includes(language)}
                            onCheckedChange={() => handleMultiSelectChange('language', language)}
                          />
                          <Label htmlFor={`mobile-language-${language}`} className="ml-2 text-sm">
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Duration</h3>
                    <Select 
                      value={filters.duration} 
                      onValueChange={(value) => handleFilterChange('duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any duration</SelectItem>
                        <SelectItem value="short">Short (≤ 12 months)</SelectItem>
                        <SelectItem value="medium">Medium (1-2 years)</SelectItem>
                        <SelectItem value="long">Long ({'>'}2 years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Tuition (per year)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="mobile-tuition-min" className="text-xs">Min ($)</Label>
                        <Input 
                          id="mobile-tuition-min" 
                          type="number" 
                          placeholder="0" 
                          value={filters.tuitionMin}
                          onChange={(e) => handleFilterChange('tuitionMin', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-tuition-max" className="text-xs">Max ($)</Label>
                        <Input 
                          id="mobile-tuition-max" 
                          type="number" 
                          placeholder="50000" 
                          value={filters.tuitionMax}
                          onChange={(e) => handleFilterChange('tuitionMax', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="mobile-scholarship" 
                        checked={filters.scholarshipAvailable}
                        onCheckedChange={() => handleCheckboxChange('scholarshipAvailable')}
                      />
                      <Label htmlFor="mobile-scholarship" className="ml-2 text-sm">
                        Scholarship Available
                      </Label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox 
                        id="mobile-internship" 
                        checked={filters.internshipOpportunities}
                        onCheckedChange={() => handleCheckboxChange('internshipOpportunities')}
                      />
                      <Label htmlFor="mobile-internship" className="ml-2 text-sm">
                        Internship Opportunities
                      </Label>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                <SelectItem value="tuition-high">Tuition: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.studyLevel.map(level => (
              <Badge key={level} variant="secondary" className="px-2 py-1">
                {level}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleMultiSelectChange('studyLevel', level)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.country.map(country => (
              <Badge key={country} variant="secondary" className="px-2 py-1">
                {country}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleMultiSelectChange('country', country)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.language.map(language => (
              <Badge key={language} variant="secondary" className="px-2 py-1">
                {language}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleMultiSelectChange('language', language)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.duration && (
              <Badge variant="secondary" className="px-2 py-1">
                Duration: {filters.duration === 'short' ? '≤ 12 months' : 
                           filters.duration === 'medium' ? '1-2 years' : '> 2 years'}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleFilterChange('duration', '')}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.tuitionMin && (
              <Badge variant="secondary" className="px-2 py-1">
                Min: ${filters.tuitionMin}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleFilterChange('tuitionMin', '')}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.tuitionMax && (
              <Badge variant="secondary" className="px-2 py-1">
                Max: ${filters.tuitionMax}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleFilterChange('tuitionMax', '')}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.scholarshipAvailable && (
              <Badge variant="secondary" className="px-2 py-1">
                Scholarship Available
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleCheckboxChange('scholarshipAvailable')}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.internshipOpportunities && (
              <Badge variant="secondary" className="px-2 py-1">
                Internship Opportunities
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleCheckboxChange('internshipOpportunities')}
                >
                  ×
                </button>
              </Badge>
            )}
            
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredPrograms.length} of {programs.length} programs
          </div>
          
          {filteredPrograms.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Programs Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any programs matching your criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="h-32 w-full md:w-48 md:h-32 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ 
                            backgroundImage: program.image_url 
                              ? `url(${program.image_url})` 
                              : `url(/placeholder.svg?height=150&width=200&text=${encodeURIComponent(program.name)})`
                          }}
                        ></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              <span>{program.university}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {program.rating && (
                              <div className="flex items-center mr-3">
                                {renderRatingStars(program.rating)}
                                <span className="ml-1 text-sm font-medium">{program.rating.toFixed(1)}</span>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={favoritePrograms.includes(program.id) ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}
                              onClick={() => toggleFavorite(program.id)}
                            >
                              <Heart className={favoritePrograms.includes(program.id) ? "fill-current" : ""} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-sm mt-1">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.country}</span>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.study_level}</span>
                          </div>
                          <div className="flex items-center">
                            <Languages className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.program_language}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.duration_months} months</span>
                          </div>
                          <div className="flex items-center">
                            <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>${Number(program.tuition_min).toLocaleString()} / year</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {program.scholarship_available && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                              Scholarship Available
                            </Badge>
                          )}
                          {program.internship_opportunities && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                              Internship Opportunities
                            </Badge>
                          )}
                          {Number(program.tuition_min) > 10000 && (
                            <Badge variant="outline" className="text-xs">
                              High Tuition
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(program.id)}>
                            View Details
                          </Button>
                          <Button size="sm" onClick={() => handleApplyNow(program.id)}>
                            Apply Now
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto"
                            onClick={() => toggleExpandProgram(program.id)}
                          >
                            {expandedProgram === program.id ? (
                              <>
                                Less Info <ChevronUp className="ml-1 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                More Info <ChevronDown className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {expandedProgram === program.id && (
                      <div className="mt-4 pt-4 border-t">
                        <Tabs defaultValue="overview">
                          <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="requirements">Requirements</TabsTrigger>
                            <TabsTrigger value="fees">Fees & Scholarships</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="overview" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Program Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {program.description || "No description available for this program."}
                              </p>
                            </div>
                            
                            {program.key_features && (
                              <div>
                                <h4 className="font-medium mb-2">Key Features</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  {program.key_features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Button variant="link" size="sm" className="text-primary" onClick={() => handleViewDetails(program.id)}>
                                View Full Details <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="requirements" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Academic Requirements</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {program.academic_requirements ? (
                                  program.academic_requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                  ))
                                ) : (
                                  <li>Contact the university for specific requirements</li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Language Requirements</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {program.language_requirements ? (
                                  program.language_requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                  ))
                                ) : (
                                  <li>Proficiency in {program.program_language} required</li>
                                )}
                              </ul>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="fees" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Tuition Fees</h4>
                              <p className="text-sm text-muted-foreground">
                                ${Number(program.tuition_min).toLocaleString()} - ${Number(program.tuition_max || program.tuition_min).toLocaleString()} per year
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Additional Costs</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Application Fee: ${program.application_fee || "Varies"}</li>
                                <li>Living Expenses: ${program.living_expenses_min || "Varies"} - ${program.living_expenses_max || "Varies"} per year</li>
                                <li>Health Insurance: ${program.health_insurance || "Varies"} per year</li>
                              </ul>
                            </div>
                            
                            {program.scholarship_available && (
                              <div>
                                <h4 className="font-medium mb-2">Scholarships</h4>
                                <p className="text-sm text-muted-foreground">
                                  Scholarships are available for this program. Contact our advisors for more information.
                                </p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showFavoritesDialog} onOpenChange={setShowFavoritesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this program from your favorites?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProgramToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeFavorite}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
