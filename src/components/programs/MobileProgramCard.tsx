
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Globe,
  Heart,
  Award,
  Download,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { generateProgramPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: string;
  name: string;
  university: string;
  country: string;
  city: string;
  study_level: string;
  field: string;
  duration_months: number;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  program_language: string;
  description?: string;
  ranking?: number;
  success_rate?: number;
  scholarship_available: boolean;
  scholarship_amount?: number;
  scholarship_details?: string;
  admission_requirements?: string;
  gpa_requirement?: number;
  language_test?: string;
  language_test_score?: string;
  application_fee?: number;
  advantages?: string;
  image_url?: string;
}

interface MobileProgramCardProps {
  program: Program;
  onViewDetails: (program: Program) => void;
  onApply: (program: Program) => void;
}

export const MobileProgramCard: React.FC<MobileProgramCardProps> = ({ 
  program, 
  onViewDetails, 
  onApply 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleDownloadBrochure = async () => {
    try {
      await generateProgramPDF(program);
      toast({
        title: "Brochure Generated",
        description: "Your program brochure is being prepared for download.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate brochure. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base line-clamp-2 mb-1">{program.name}</h3>
            <p className="text-sm text-muted-foreground">{program.university}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              {program.city}, {program.country}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <GraduationCap className="w-3 h-3 mr-1" />
            {program.study_level}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {program.field}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {program.duration_months}m
          </Badge>
          {program.scholarship_available && (
            <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
              Scholarship
            </Badge>
          )}
        </div>

        {/* Costs */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Annual Tuition</span>
            <span className="text-sm font-bold text-green-600">
              €{program.tuition_min.toLocaleString()}-{program.tuition_max.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Language & Success Rate */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {program.program_language}
          </div>
          {program.success_rate && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {program.success_rate}% Success
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button 
              onClick={() => onViewDetails(program)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Details
            </Button>
            <Button 
              onClick={handleDownloadBrochure}
              variant="outline"
              size="sm"
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
          <Button 
            onClick={() => onApply(program)}
            className="w-full bg-gradient-to-r from-primary to-primary/80"
            size="sm"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
