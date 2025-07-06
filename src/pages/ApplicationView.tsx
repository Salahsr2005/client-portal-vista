import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  Building, Globe, GraduationCap, ArrowLeft, Loader2, MessageSquare,
  Calendar, User, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ApplicationDetail {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  priority: string;
  payment_status: string;
  program_id?: string;
  destination_id?: string;
  service_id?: string;
  type: 'program' | 'destination' | 'service';
}

export default function ApplicationView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');

  // Fetch application from all sources
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id || !user) return null;

      // Try programs first
      const { data: programApp, error: programError } = await supabase
        .from('applications')
        .select(`
          *,
          programs (
            id, name, university, city, country, image_url,
            tuition_min, tuition_max, study_level
          )
        `)
        .eq('application_id', id)
        .eq('client_id', user.id)
        .maybeSingle();

      if (programApp) {
        return {
          ...programApp,
          type: 'program' as const,
          related_data: programApp.programs
        };
      }

      // Try destinations
      const { data: destApp, error: destError } = await supabase
        .from('destination_applications')
        .select(`
          *,
          destinations (
            id, name, country, logo_url, cover_image_url,
            bachelor_tuition_min, master_tuition_min, phd_tuition_min
          )
        `)
        .eq('id', id)
        .eq('client_id', user.id)
        .maybeSingle();

      if (destApp) {
        return {
          ...destApp,
          type: 'destination' as const,
          related_data: destApp.destinations
        };
      }

      // Try services
      const { data: serviceApp, error: serviceError } = await supabase
        .from('service_applications')
        .select(`
          *,
          services (
            service_id, name, description, price, category
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (serviceApp) {
        return {
          ...serviceApp,
          type: 'service' as const,
          related_data: serviceApp.services
        };
      }

      throw new Error('Application not found');
    },
    enabled: !!id && !!user
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading application...</span>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4"
      >
        <Card className="max-w-2xl mx-auto border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="mr-2" />
              Application Not Found
            </CardTitle>
            <CardDescription>
              The application you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate('/applications')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Applications
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'in review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'in review':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/applications')}
          className="mr-4 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Applications
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Application Details</h1>
          <p className="text-muted-foreground">
            {application.type === 'program' ? 'Program Application' : 
             application.type === 'destination' ? 'Destination Application' : 
             'Service Application'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(application.status)}
                  <span className="ml-2">Application #{
                    (application.type === 'program' ? application.application_id : 
                     application.type === 'destination' ? application.id :
                     application.id).substring(0, 8)
                  }</span>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Submitted on {formatDate(application.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  {/* Related Item Information */}
                  {application.related_data && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-card/40 rounded-xl border"
                    >
                      <div className="flex items-start space-x-4">
                        {application.type === 'program' && (
                          <>
                            <div 
                              className="w-16 h-16 rounded-md bg-cover bg-center shrink-0 shadow-md"
                              style={{ 
                                backgroundImage: `url(${application.related_data.image_url || '/placeholder.svg'})` 
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{application.related_data.name}</h3>
                              <p className="text-muted-foreground">{application.related_data.university}</p>
                              <p className="text-sm text-muted-foreground">
                                {application.related_data.city}, {application.related_data.country}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  {application.related_data.study_level}
                                </Badge>
                                <Badge variant="outline">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  €{application.related_data.tuition_min?.toLocaleString()} - €{application.related_data.tuition_max?.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {application.type === 'destination' && (
                          <>
                            <div 
                              className="w-16 h-16 rounded-md bg-cover bg-center shrink-0 shadow-md"
                              style={{ 
                                backgroundImage: `url(${application.related_data.logo_url || application.related_data.cover_image_url || '/placeholder.svg'})` 
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{application.related_data.name}</h3>
                              <p className="text-muted-foreground flex items-center">
                                <Globe className="h-4 w-4 mr-1" />
                                {application.related_data.country}
                              </p>
                              <Badge variant="outline" className="mt-2">
                                {application.program_level || 'All Levels'}
                              </Badge>
                            </div>
                          </>
                        )}
                        
                        {application.type === 'service' && (
                          <>
                            <div className="w-16 h-16 rounded-md bg-primary/10 shrink-0 shadow-md flex items-center justify-center">
                              <Building className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{application.related_data.name}</h3>
                              <p className="text-muted-foreground">{application.related_data.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">{application.related_data.category}</Badge>
                                <Badge variant="outline">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  €{application.related_data.price}
                                </Badge>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Application Notes */}
                  {application.notes && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="font-medium mb-2 flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                        Notes
                      </h3>
                      <div className="bg-muted/50 rounded-md p-4 text-sm border">
                        {application.notes}
                      </div>
                    </motion.div>
                  )}
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="mx-auto h-10 w-10 opacity-20 mb-3" />
                    <p>Timeline feature coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-10 w-10 opacity-20 mb-3" />
                    <p>No documents uploaded yet</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Status</span>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority</span>
                <Badge variant="outline">
                  {(application as any).priority || 'Medium'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <Badge variant="outline">{application.payment_status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Submitted</div>
                <div className="text-sm font-medium">
                  {formatDate(application.created_at)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last Updated</div>
                <div className="text-sm font-medium">
                  {formatDate(application.updated_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}