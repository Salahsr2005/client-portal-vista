
import React from 'react';
import { X, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Program } from '@/components/consultation/types';

interface CompareProgramsProps {
  programs: Program[];
  onClose: () => void;
  onRemoveProgram: (id: string) => void;
}

const ComparePrograms: React.FC<CompareProgramsProps> = ({ programs, onClose, onRemoveProgram }) => {
  if (!programs.length) return null;
  
  // Fields to compare
  const fields = [
    { key: 'university', label: 'University' },
    { key: 'study_level', label: 'Level' },
    { key: 'program_language', label: 'Language' },
    { key: 'duration', label: 'Duration' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'field', label: 'Field of Study' },
    { key: 'tuition_min', label: 'Tuition Fee (min)' },
    { key: 'tuition_max', label: 'Tuition Fee (max)' },
    { key: 'scholarship_available', label: 'Scholarship Available' },
    { key: 'religious_facilities', label: 'Religious Facilities' },
    { key: 'halal_food_availability', label: 'Halal Food' },
    { key: 'application_deadline', label: 'Application Deadline' },
  ];

  const formatValue = (key: string, value: any) => {
    if (value === undefined || value === null) {
      return <span className="text-muted-foreground">Not specified</span>;
    }

    if (typeof value === 'boolean') {
      return value ? <CheckCircle className="text-green-500 h-5 w-5" /> : <XCircle className="text-red-500 h-5 w-5" />;
    }

    if (key === 'tuition_min' || key === 'tuition_max') {
      return `€${value.toLocaleString()}`;
    }

    return value;
  };

  return (
    <Card className="w-full mt-6 animate-in fade-in-10">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/40 pb-2">
        <CardTitle className="text-xl">Compare Programs</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <ScrollArea className="max-w-full">
        <CardContent>
          <div className="flex w-full py-2">
            <div className="w-1/4 min-w-[150px] pr-4 font-medium">
              <p className="sticky top-0 bg-background py-2">Program Name</p>
            </div>
            
            <div className="flex-1 flex gap-4 overflow-x-auto">
              {programs.map(program => (
                <div key={program.id} className="min-w-[200px] max-w-[250px] flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-ellipsis overflow-hidden">{program.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => onRemoveProgram(program.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-2" />
          
          {fields.map((field, index) => (
            <div key={field.key} className="flex w-full py-3 border-b border-gray-100 last:border-0">
              <div className="w-1/4 min-w-[150px] pr-4 font-medium">
                <p>{field.label}</p>
              </div>
              
              <div className="flex-1 flex gap-4 overflow-x-auto">
                {programs.map(program => (
                  <div key={program.id} className="min-w-[200px] max-w-[250px] flex-1">
                    {formatValue(field.key, program[field.key as keyof Program])}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
      
      <CardFooter className="justify-end bg-muted/40 pt-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
};

export default ComparePrograms;
