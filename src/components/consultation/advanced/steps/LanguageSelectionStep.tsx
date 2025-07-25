
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Globe,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LanguageSelectionProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

const LANGUAGES = [
  { id: 'English', name: 'English', flag: '🇬🇧', popularity: 'Most Popular' },
  { id: 'French', name: 'French', flag: '🇫🇷', popularity: 'Popular' },
  { id: 'Spanish', name: 'Spanish', flag: '🇪🇸', popularity: 'Popular' },
  { id: 'German', name: 'German', flag: '🇩🇪', popularity: 'Popular' },
  { id: 'Italian', name: 'Italian', flag: '🇮🇹', popularity: 'Common' },
  { id: 'Portuguese', name: 'Portuguese', flag: '🇵🇹', popularity: 'Common' },
  { id: 'Dutch', name: 'Dutch', flag: '🇳🇱', popularity: 'Common' },
  { id: 'Polish', name: 'Polish', flag: '🇵🇱', popularity: 'Available' }
];

const LANGUAGE_TESTS = {
  English: ['IELTS', 'TOEFL', 'Cambridge', 'PTE'],
  French: ['DELF', 'DALF', 'TCF', 'TEF'],
  Spanish: ['DELE', 'SIELE'],
  German: ['TestDaF', 'DSH', 'Goethe'],
  Italian: ['CILS', 'CELI'],
  Portuguese: ['CELPE-Bras'],
  Dutch: ['NT2'],
  Polish: ['Polish Certificate']
};

export function LanguageSelectionStep({ data, updateData, onValidation }: LanguageSelectionProps) {
  const { language, languageTestRequired, languageTestScore } = data;

  useEffect(() => {
    onValidation(!!language);
  }, [language, onValidation]);

  const handleLanguageSelect = (selectedLanguage: string) => {
    updateData({ 
      language: selectedLanguage,
      languageTestRequired: false,
      languageTestScore: ''
    });
  };

  const handleTestRequiredChange = (required: boolean) => {
    updateData({ 
      languageTestRequired: required,
      languageTestScore: required ? languageTestScore : ''
    });
  };

  const handleTestScoreChange = (score: string) => {
    updateData({ languageTestScore: score });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Language Preferences</h2>
        <p className="text-muted-foreground text-lg">
          Choose your preferred language of instruction
        </p>
      </div>

      {/* Language Selection */}
      <div className="grid md:grid-cols-4 gap-4">
        {LANGUAGES.map((lang, index) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                language === lang.id 
                  ? 'ring-2 ring-offset-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleLanguageSelect(lang.id)}
            >
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-3xl">{lang.flag}</div>
                  <div>
                    <h3 className="font-semibold">{lang.name}</h3>
                    <Badge 
                      variant={lang.popularity === 'Most Popular' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {lang.popularity}
                    </Badge>
                  </div>

                  {language === lang.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Language Test Section */}
      {language && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-2 border-dashed border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-indigo-500" />
                    <div>
                      <Label className="text-base font-medium">Language Test Requirement</Label>
                      <p className="text-sm text-muted-foreground">
                        Do you need to take a language proficiency test?
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={languageTestRequired}
                    onCheckedChange={handleTestRequiredChange}
                  />
                </div>

                {languageTestRequired && LANGUAGE_TESTS[language as keyof typeof LANGUAGE_TESTS] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Test Type</Label>
                        <Select value={languageTestScore.split(':')[0] || ''} onValueChange={(test) => handleTestScoreChange(`${test}:`)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose test type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_TESTS[language as keyof typeof LANGUAGE_TESTS].map(test => (
                              <SelectItem key={test} value={test}>{test}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Score/Level</Label>
                        <Select 
                          value={languageTestScore.split(':')[1] || ''} 
                          onValueChange={(score) => {
                            const testType = languageTestScore.split(':')[0] || '';
                            handleTestScoreChange(`${testType}:${score}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your score" />
                          </SelectTrigger>
                          <SelectContent>
                            {language === 'English' && (
                              <>
                                <SelectItem value="6.0-6.5">IELTS 6.0-6.5 / TOEFL 60-78</SelectItem>
                                <SelectItem value="7.0-7.5">IELTS 7.0-7.5 / TOEFL 79-93</SelectItem>
                                <SelectItem value="8.0+">IELTS 8.0+ / TOEFL 94+</SelectItem>
                              </>
                            )}
                            {language === 'French' && (
                              <>
                                <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                                <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                                <SelectItem value="C1">C1 (Advanced)</SelectItem>
                                <SelectItem value="C2">C2 (Proficient)</SelectItem>
                              </>
                            )}
                            {language !== 'English' && language !== 'French' && (
                              <>
                                <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                                <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                                <SelectItem value="C1">C1 (Advanced)</SelectItem>
                                <SelectItem value="C2">C2 (Proficient)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!languageTestRequired && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Great! Many programs offer exemptions or alternatives.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Language Requirements Tip</p>
                <p>
                  Many universities offer foundation courses or alternative assessment methods. 
                  We'll match you with programs that align with your current language level.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
