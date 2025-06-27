
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Destination } from '@/hooks/useDestinations';

interface ModernDestinationCardProps {
  destination: Destination;
  onViewDetails: (destination: Destination) => void;
}

export const ModernDestinationCard: React.FC<ModernDestinationCardProps> = ({ 
  destination, 
  onViewDetails 
}) => {
  const getAcademicLevelColor = (level?: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Any': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
        {/* Header with cover image */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
            style={{
              backgroundImage: destination.cover_image_url ? `url(${destination.cover_image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          
          {/* Logo and Country Badge */}
          <div className="absolute top-4 left-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              {destination.logo_url ? (
                <img src={destination.logo_url} alt={destination.name} className="w-8 h-8 rounded-full" />
              ) : (
                <Globe className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
              {destination.country}
            </Badge>
          </div>

          {/* Success Rates */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {destination.admission_success_rate}% Admission
            </div>
            <div className="bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              {destination.visa_success_rate}% Visa
            </div>
          </div>

          {/* Title at bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
            <p className="text-blue-100 text-sm opacity-90">{destination.procedure_type}</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {destination.description}
          </p>

          {/* Available Programs */}
          <div className="flex flex-wrap gap-2">
            {destination.available_programs?.map((program) => (
              <Badge key={program} variant="outline" className="text-xs">
                <GraduationCap className="w-3 h-3 mr-1" />
                {program}
              </Badge>
            ))}
          </div>

          {/* Tuition Ranges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
              <div className="flex items-center text-blue-600 mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Bachelor</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                €{destination.bachelor_tuition_min?.toLocaleString()} - €{destination.bachelor_tuition_max?.toLocaleString()}
              </p>
              <Badge className={`text-xs mt-1 ${getAcademicLevelColor(destination.bachelor_academic_level)}`}>
                {destination.bachelor_academic_level} Level
              </Badge>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
              <div className="flex items-center text-purple-600 mb-1">
                <Award className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Master</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                €{destination.master_tuition_min?.toLocaleString()} - €{destination.master_tuition_max?.toLocaleString()}
              </p>
              <Badge className={`text-xs mt-1 ${getAcademicLevelColor(destination.master_academic_level)}`}>
                {destination.master_academic_level} Level
              </Badge>
            </div>
          </div>

          {/* Key Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {destination.processing_time}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {destination.agency_services?.length || 0} Services
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => onViewDetails(destination)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
