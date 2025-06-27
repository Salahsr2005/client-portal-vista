
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  FileText,
  DollarSign,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle,
  Calendar,
  Languages,
  Building,
  Briefcase
} from 'lucide-react';
import { Destination } from '@/hooks/useDestinations';

interface DestinationDetailModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  isOpen,
  onClose
}) => {
  if (!destination) return null;

  const getAcademicLevelColor = (level?: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Any': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const programLevels = [
    {
      name: 'Bachelor',
      tuition_min: destination.bachelor_tuition_min,
      tuition_max: destination.bachelor_tuition_max,
      academic_level: destination.bachelor_academic_level,
      requirements: destination.bachelor_requirements,
      documents: destination.bachelor_documents
    },
    {
      name: 'Master',
      tuition_min: destination.master_tuition_min,
      tuition_max: destination.master_tuition_max,
      academic_level: destination.master_academic_level,
      requirements: destination.master_requirements,
      documents: destination.master_documents
    },
    {
      name: 'PhD',
      tuition_min: destination.phd_tuition_min,
      tuition_max: destination.phd_tuition_max,
      academic_level: destination.phd_academic_level,
      requirements: destination.phd_requirements,
      documents: destination.phd_documents
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {destination.logo_url ? (
                <img src={destination.logo_url} alt={destination.name} className="w-12 h-12 rounded-full" />
              ) : (
                <Globe className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{destination.name}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{destination.country}</Badge>
                <Badge variant="secondary">{destination.procedure_type}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {destination.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{destination.admission_success_rate}%</div>
                      <div className="text-sm text-gray-600">Admission Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{destination.visa_success_rate}%</div>
                      <div className="text-sm text-gray-600">Visa Success</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-purple-600">{destination.processing_time}</div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <Briefcase className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{destination.agency_services?.length || 0}</div>
                      <div className="text-sm text-gray-600">Services</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Languages className="w-5 h-5 mr-2" />
                      Language Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {destination.language_requirements}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Intake Periods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {destination.intake_periods?.map((period) => (
                        <Badge key={period} variant="outline">{period}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
              {programLevels.map((program) => (
                <Card key={program.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        {program.name} Programs
                      </div>
                      <Badge className={getAcademicLevelColor(program.academic_level)}>
                        {program.academic_level} Level Required
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          €{program.tuition_min?.toLocaleString()} - €{program.tuition_max?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{program.requirements}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Required Documents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.documents?.map((doc) => (
                          <Badge key={doc} variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Requirements Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {programLevels.map((program) => (
                      <div key={program.name} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {program.name}
                        </h4>
                        <Badge className={`mb-2 ${getAcademicLevelColor(program.academic_level)}`}>
                          {program.academic_level} Level
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {program.requirements}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {destination.agency_services?.map((service) => (
                        <div key={service} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{service.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Fees</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <span className="text-sm">Application Fee</span>
                      <span className="font-semibold">€{destination.application_fee}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                      <span className="text-sm">Service Fee</span>
                      <span className="font-semibold">€{destination.service_fee}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
                      <span className="text-sm">Visa Processing Fee</span>
                      <span className="font-semibold">€{destination.visa_processing_fee}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
