import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Users,
  MapPin,
  Heart,
  Star,
  Sparkles,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Destination } from '@/hooks/useDestinations';
import { generateDestinationPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDestinationCardProps {
  destination: Destination;
  onViewDetails: (destination: Destination) => void;
  onApply: (destination: Destination) => void;
}

export const EnhancedDestinationCard: React.FC<EnhancedDestinationCardProps> = ({ 
  destination, 
  onViewDetails,
  onApply
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleDownloadBrochure = async () => {
    try {
      await generateDestinationPDF(destination);
      toast({
        title: "Brochure Generated",
        description: "Your destination brochure is being prepared for download.",
      });
    } catch (error) {
      toast({
        title: "Download Failed", 
        description: "Failed to generate brochure. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAcademicLevelColor = (level?: string) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'Any': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group border-0 shadow-xl bg-card/90 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Header with cover image */}
      <div className="relative h-56 overflow-hidden">
        {!imageError && destination.cover_image_url ? (
          <img
            src={destination.cover_image_url}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
            <Globe className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay Gradient */}
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
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Country Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0 hover:bg-white">
            <MapPin className="w-3 h-3 mr-1" />
            {destination.country}
          </Badge>
        </div>

        {/* Success Rates */}
        <div className="absolute top-16 right-4 flex flex-col gap-2">
          <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {destination.admission_success_rate}% Admission
          </Badge>
          <Badge className="bg-blue-500/90 text-white backdrop-blur-sm border-0 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            {destination.visa_success_rate}% Visa
          </Badge>
        </div>

        {/* Title at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{destination.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
              {destination.procedure_type}
            </Badge>
            <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/30 text-xs backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Available Programs */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Available Programs</h4>
          <div className="flex flex-wrap gap-2">
            {destination.available_programs?.slice(0, 3).map((program) => (
              <Badge key={program} variant="secondary" className="text-xs border">
                <GraduationCap className="w-3 h-3 mr-1" />
                {program}
              </Badge>
            ))}
            {(destination.available_programs?.length || 0) > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(destination.available_programs?.length || 0) - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Tuition Ranges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
            <div className="flex items-center text-blue-600 mb-2">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">Bachelor</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              €{destination.bachelor_tuition_min?.toLocaleString()} - €{destination.bachelor_tuition_max?.toLocaleString()}
            </p>
            <Badge className={`text-xs mt-2 ${getAcademicLevelColor(destination.bachelor_academic_level)}`} variant="outline">
              {destination.bachelor_academic_level} Level
            </Badge>
          </div>
          
          <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
            <div className="flex items-center text-purple-600 mb-2">
              <Award className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">Master</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              €{destination.master_tuition_min?.toLocaleString()} - €{destination.master_tuition_max?.toLocaleString()}
            </p>
            <Badge className={`text-xs mt-2 ${getAcademicLevelColor(destination.master_academic_level)}`} variant="outline">
              {destination.master_academic_level} Level
            </Badge>
          </div>
        </div>

        {/* Key Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{destination.processing_time || 'Contact for details'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{destination.agency_services?.length || 0} Services</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <Button 
              onClick={() => onViewDetails(destination)}
              variant="outline"
              className="flex-1 border-border/50 hover:border-primary hover:text-primary transition-colors"
            >
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
            onClick={() => onApply(destination)}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-0 group shadow-lg hover:shadow-xl transition-all"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};