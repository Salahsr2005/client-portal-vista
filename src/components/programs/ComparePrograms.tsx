
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { CurrencyCode, formatCurrency } from '@/utils/currencyConverter';

export interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  study_level?: string;
  type?: string;
  duration: string;
  tuition_min?: number;
  program_language?: string;
  application_deadline?: string;
  deadline?: string;
  scholarship_available?: boolean;
  hasScholarship?: boolean;
  religious_facilities?: boolean;
  hasReligiousFacilities?: boolean;
  halal_food_availability?: boolean;
  hasHalalFood?: boolean;
  [key: string]: any;
}

interface CompareProgramsProps {
  programs: Program[];
  onClose: () => void;
  onRemoveProgram: (id: string) => void;
  currency?: CurrencyCode;
}

const ComparePrograms: React.FC<CompareProgramsProps> = ({ 
  programs, 
  onClose, 
  onRemoveProgram,
  currency = 'EUR'
}) => {
  const attributes = [
    { label: 'University', getter: (p: Program) => p.university },
    { label: 'Location', getter: (p: Program) => p.location },
    { label: 'Study Level', getter: (p: Program) => p.study_level || p.type },
    { label: 'Duration', getter: (p: Program) => p.duration },
    { label: 'Tuition Fee', getter: (p: Program) => 
      p.tuition_min 
        ? formatCurrency(p.tuition_min, 'EUR', currency)
        : 'Not specified' 
    },
    { label: 'Language', getter: (p: Program) => p.program_language || 'Not specified' },
    { label: 'Application Deadline', getter: (p: Program) => p.application_deadline || p.deadline || 'Not specified' },
    { label: 'Scholarship Available', getter: (p: Program) => 
      p.scholarship_available || p.hasScholarship ? 'Yes' : 'No'
    },
    { label: 'Religious Facilities', getter: (p: Program) => 
      p.religious_facilities || p.hasReligiousFacilities ? 'Yes' : 'No'
    },
    { label: 'Halal Food Availability', getter: (p: Program) => 
      p.halal_food_availability || p.hasHalalFood ? 'Yes' : 'No'
    },
  ];

  return (
    <Card className="mb-8 w-full overflow-hidden">
      <CardHeader className="bg-primary/5 flex flex-row justify-between items-center">
        <CardTitle className="text-xl">Compare Programs</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-4 overflow-x-auto">
        <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {/* Header row with program names */}
          <div className="font-medium text-muted-foreground pt-4">Attributes</div>
          {programs.map(program => (
            <div key={program.id} className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-0 right-0 h-6 w-6"
                onClick={() => onRemoveProgram(program.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
            </div>
          ))}

          {/* Rows for each attribute */}
          {attributes.map((attr, index) => (
            <React.Fragment key={attr.label}>
              <div className={`${index % 2 === 0 ? 'bg-muted/50' : ''} p-2 font-medium`}>
                {attr.label}
              </div>

              {programs.map(program => (
                <div 
                  key={`${program.id}-${attr.label}`} 
                  className={`${index % 2 === 0 ? 'bg-muted/50' : ''} p-2`}
                >
                  {attr.getter(program)}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Action row */}
          <div className="p-2 font-medium">Actions</div>
          {programs.map(program => (
            <div key={`${program.id}-actions`} className="p-2 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <a href={`/programs/${program.id}`}>View Details</a>
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <a href={`/applications/new?program=${program.id}`}>Apply Now</a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparePrograms;
