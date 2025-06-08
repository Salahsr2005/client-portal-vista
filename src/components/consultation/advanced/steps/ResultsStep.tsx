
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  Heart,
  Award,
  ExternalLink,
  Star,
  Sparkles,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface ResultsStepProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

interface MatchedProgram {
  program_id: string;
  program_name: string;
  university: string;
  country: string;
  city: string;
  match_percentage: number;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  program_language: string;
  scholarship_available: boolean;
  religious_facilities: boolean;
  halal_food_availability: boolean;
}

export function ResultsStep({ data, updateData, onValidation }: ResultsStepProps) {
  const [matchedPrograms, setMatchedPrograms] = useState<MatchedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onValidation(true);
    fetchMatchedPrograms();
  }, [onValidation]);

  const fetchMatchedPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: programs, error: fetchError } = await supabase.rpc('get_matched_programs', {
        p_study_level: data.level,
        p_field: data.field,
        p_language: data.language,
        p_budget: data.budget,
        p_living_costs: data.livingCosts,
        p_language_test_required: data.languageTestRequired,
        p_religious_facilities: data.religiousFacilities,
        p_halal_food: data.halalFood,
        p_scholarship_required: data.scholarshipRequired,
        p_limit: 20
      });

      if (fetchError) throw fetchError;

      setMatchedPrograms(programs || []);
    } catch (err) {
      console.error('Error fetching matched programs:', err);
      setError('Failed to load program matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4"
        >
          <Sparkles className="w-16 h-16 text-indigo-600" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Finding Your Perfect Matches</h3>
        <p className="text-muted-foreground">
          Our AI is analyzing thousands of programs to find the best fits for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchMatchedPrograms} className="bg-indigo-600 hover:bg-indigo-700">
          Try Again
        </Button>
      </div>
    );
  }

  if (matchedPrograms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Perfect Matches Found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find programs that exactly match your level and field requirements. 
          Consider adjusting your preferences or exploring alternative fields.
        </p>
        <div className="space-y-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Adjust Preferences
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Browse All Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <Trophy className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Your Perfect Program Matches!</h2>
        <p className="text-muted-foreground text-lg">
          We found {matchedPrograms.length} programs that match your preferences
        </p>
      </div>

      {/* Match Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{matchedPrograms.length}</div>
              <div className="text-sm text-muted-foreground">Total Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {matchedPrograms.filter(p => p.match_percentage >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Excellent Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {matchedPrograms.filter(p => p.scholarship_available).length}
              </div>
              <div className="text-sm text-muted-foreground">With Scholarships</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(matchedPrograms.map(p => p.country)).size}
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Results */}
      <div className="space-y-4">
        <AnimatePresence>
          {matchedPrograms.map((program, index) => (
            <motion.div
              key={program.program_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{program.program_name}</h3>
                        <Badge className={getMatchBadgeColor(program.match_percentage)}>
                          {Math.round(program.match_percentage)}% Match
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{program.university}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{program.city}, {program.country}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{program.program_language}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchColor(program.match_percentage)} mb-1`}>
                        {Math.round(program.match_percentage)}%
                      </div>
                      <Progress 
                        value={program.match_percentage} 
                        className="w-20 h-2"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium">Tuition</div>
                        <div className="text-sm text-muted-foreground">
                          €{program.tuition_min.toLocaleString()} - €{program.tuition_max.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Living Costs</div>
                        <div className="text-sm text-muted-foreground">
                          €{program.living_cost_min.toLocaleString()} - €{program.living_cost_max.toLocaleString()}/year
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Features</div>
                        <div className="flex space-x-1">
                          {program.scholarship_available && (
                            <Badge variant="outline" className="text-xs">Scholarship</Badge>
                          )}
                          {program.religious_facilities && (
                            <Badge variant="outline" className="text-xs">Religious</Badge>
                          )}
                          {program.halal_food_availability && (
                            <Badge variant="outline" className="text-xs">Halal</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center pt-6">
        <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
          <Trophy className="w-5 h-5 mr-2" />
          Apply to Selected Programs
        </Button>
      </div>
    </div>
  );
}
