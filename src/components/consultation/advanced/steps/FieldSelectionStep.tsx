
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  BookOpen, 
  Code, 
  Microscope, 
  Briefcase,
  Palette,
  Heart,
  Calculator,
  Globe,
  Hammer,
  Music,
  Users
} from 'lucide-react';

interface FieldSelectionProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

const FIELD_ICONS: { [key: string]: any } = {
  'Computer Science': Code,
  'Engineering': Hammer,
  'Business': Briefcase,
  'Medicine': Heart,
  'Arts': Palette,
  'Sciences': Microscope,
  'Mathematics': Calculator,
  'Languages': Globe,
  'Music': Music,
  'Social Sciences': Users,
  'default': BookOpen
};

export function FieldSelectionStep({ data, updateData, onValidation }: FieldSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [studyFields, setStudyFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredFields, setFilteredFields] = useState<any[]>([]);

  const selectedField = data.field;

  useEffect(() => {
    fetchStudyFields();
  }, []);

  useEffect(() => {
    onValidation(!!selectedField);
  }, [selectedField, onValidation]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = studyFields.filter(field => 
        field.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.field_keywords?.some((keyword: string) => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredFields(filtered);
    } else {
      setFilteredFields(studyFields);
    }
  }, [searchTerm, studyFields]);

  const fetchStudyFields = async () => {
    try {
      const { data: fields, error } = await supabase.rpc('get_study_fields');
      if (error) throw error;
      setStudyFields(fields || []);
      setFilteredFields(fields || []);
    } catch (error) {
      console.error('Error fetching study fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSelect = (field: string, keywords: string[] = []) => {
    updateData({ 
      field, 
      fieldKeywords: keywords 
    });
  };

  const getFieldIcon = (fieldName: string) => {
    const IconComponent = FIELD_ICONS[fieldName] || FIELD_ICONS.default;
    return IconComponent;
  };

  const getFieldColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-yellow-500 to-amber-500',
      'from-teal-500 to-cyan-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">What field would you like to study?</h2>
        <p className="text-muted-foreground text-lg">
          Choose your area of interest or search for specific programs
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for fields or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Study Fields */}
      {loading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFields.map((field, index) => {
            const IconComponent = getFieldIcon(field.field);
            const isSelected = selectedField === field.field;
            
            return (
              <motion.div
                key={field.field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    isSelected 
                      ? 'ring-2 ring-offset-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleFieldSelect(field.field, field.field_keywords)}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${getFieldColor(index)}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-sm mb-2">{field.field}</h3>
                        
                        {field.field_keywords && field.field_keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {field.field_keywords.slice(0, 3).map((keyword: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {field.field_keywords.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{field.field_keywords.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex justify-center"
                        >
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {filteredFields.length === 0 && !loading && searchTerm && (
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No fields found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords or browse all available fields
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSearchTerm('')}
            className="mt-4"
          >
            Show All Fields
          </Button>
        </div>
      )}

      {selectedField && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">
              Excellent! We'll find programs in {selectedField} that match your preferences.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
