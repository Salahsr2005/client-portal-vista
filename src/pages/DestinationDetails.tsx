import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '@/hooks/useDestinations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Globe,
  TrendingUp,
  CheckCircle,
  Clock,
  Briefcase,
  Languages,
  Calendar,
  GraduationCap,
  FileText,
  DollarSign,
  MapPin,
  Star,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DestinationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: destinations, isLoading } = useDestinations();
  
  const destination = destinations?.find(d => d.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-7xl py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-1/4" />
            <div className="h-96 bg-muted rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-xl" />
                <div className="h-64 bg-muted rounded-xl" />
              </div>
              <div className="h-96 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Destination not found</h2>
            <p className="text-muted-foreground mb-4">
              The destination you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/destinations')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAcademicLevelColor = (level?: string) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-600';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'Any': return 'bg-green-500/10 text-green-600';
      default: return 'bg-muted text-muted-foreground';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-7xl py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/destinations')}
            className="mb-6 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl"
        >
          {destination.cover_image_url ? (
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/40 via-primary/20 to-background flex items-center justify-center">
              <Globe className="w-24 h-24 text-primary/60" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {destination.country}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {destination.procedure_type}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {destination.name}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl">
                  {destination.description}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{destination.admission_success_rate}%</div>
                      <div className="text-xs text-muted-foreground">Admission Rate</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{destination.visa_success_rate}%</div>
                      <div className="text-xs text-muted-foreground">Visa Success</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-purple-600">{destination.processing_time}</div>
                      <div className="text-xs text-muted-foreground">Processing Time</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Briefcase className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{destination.agency_services?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Services</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Languages className="w-5 h-5 mr-2" />
                        Language Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {destination.language_requirements || 'Contact for details'}
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
                        )) || <span className="text-sm text-muted-foreground">Contact for details</span>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="space-y-6">
                {programLevels.filter(program => program.tuition_min && program.tuition_max).map((program) => (
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
                      
                      {program.requirements && (
                        <div>
                          <h4 className="font-medium mb-2">Requirements:</h4>
                          <p className="text-sm text-muted-foreground">{program.requirements}</p>
                        </div>
                      )}
                      
                      {program.documents && program.documents.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Required Documents:</h4>
                          <div className="flex flex-wrap gap-2">
                            {program.documents.map((doc) => (
                              <Badge key={doc} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Requirements Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {programLevels.filter(program => program.requirements).map((program) => (
                        <div key={program.name} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {program.name}
                          </h4>
                          <Badge className={`mb-2 ${getAcademicLevelColor(program.academic_level)}`}>
                            {program.academic_level} Level
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {program.requirements}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {destination.agency_services?.map((service) => (
                          <div key={service} className="flex items-center p-2 bg-muted/50 rounded">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">{service.replace('_', ' ')}</span>
                          </div>
                        )) || <span className="text-sm text-muted-foreground">Contact for service details</span>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Service Fees</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {destination.application_fee && (
                        <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded">
                          <span className="text-sm">Application Fee</span>
                          <span className="font-semibold">€{destination.application_fee}</span>
                        </div>
                      )}
                      {destination.service_fee && (
                        <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded">
                          <span className="text-sm">Service Fee</span>
                          <span className="font-semibold">€{destination.service_fee}</span>
                        </div>
                      )}
                      {destination.visa_processing_fee && (
                        <div className="flex justify-between items-center p-3 bg-green-500/10 rounded">
                          <span className="text-sm">Visa Processing Fee</span>
                          <span className="font-semibold">€{destination.visa_processing_fee}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Students Enrolled</span>
                  <span className="text-sm font-medium">856</span>
                </div>
              </CardContent>
            </Card>

            {/* Apply Now */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  Apply Now
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Start your application today and get expert guidance
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Chat with Advisor
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Call
                </Button>
                <Button variant="outline" className="w-full">
                  Download Brochure
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}