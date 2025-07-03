
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Globe, 
  Heart,
  Users,
  Award,
  Download,
  ExternalLink,
  Star
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

interface ModernProgramCardProps {
  program: Program;
  onViewDetails: (program: Program) => void;
  onApply: (program: Program) => void;
}

export const ModernProgramCard: React.FC<ModernProgramCardProps> = ({ 
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

  const totalCostMin = program.tuition_min + (program.living_cost_min * 12);
  const totalCostMax = program.tuition_max + (program.living_cost_max * 12);

  return (
    <Card className="group border-0 shadow-xl bg-card/90 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        {program.image_url ? (
          <img
            src={program.image_url}
            alt={program.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </motion.button>
          {program.ranking && (
            <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-sm font-medium">#{program.ranking}</span>
            </div>
          )}
        </div>

        {/* Country Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
            <MapPin className="w-3 h-3 mr-1" />
            {program.country}
          </Badge>
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">
            {program.name}
          </h3>
          <p className="text-gray-200 text-sm drop-shadow">
            {program.university} • {program.city}
          </p>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Program Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              {program.study_level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {program.field}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {program.duration_months} months
          </div>
        </div>

        {/* Description */}
        {program.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {program.description}
          </p>
        )}

        {/* Costs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Annual Tuition</span>
            <span className="text-sm font-bold text-green-600">
              €{program.tuition_min.toLocaleString()} - €{program.tuition_max.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Cost (with living)</span>
            <span className="text-xs text-muted-foreground">
              €{totalCostMin.toLocaleString()} - €{totalCostMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          {program.scholarship_available && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Scholarship
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <Button 
              onClick={() => onViewDetails(program)}
              variant="outline"
              className="flex-1 border-border/50 hover:border-primary hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              onClick={handleDownloadBrochure}
              variant="outline"
              size="sm"
              className="border-border/50 hover:border-primary hover:text-primary transition-colors"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={() => onApply(program)}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
