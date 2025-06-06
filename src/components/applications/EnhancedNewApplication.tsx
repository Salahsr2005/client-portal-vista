
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileText, User, MapPin, Calendar, CreditCard } from 'lucide-react';

const applicationSchema = z.object({
  program_id: z.string().min(1, 'Please select a program'),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function EnhancedNewApplication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      program_id: '',
      notes: '',
    },
  });

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('client_users')
        .select('*, client_profiles(*)')
        .eq('client_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch programs
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'Active')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('applications')
        .insert({
          client_id: user.id,
          program_id: data.program_id,
          status: 'Draft',
          notes: data.notes,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Application Created',
        description: 'Your application has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      navigate('/applications');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create application',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    submitApplication.mutate(data);
  };

  // Update selected program when program_id changes
  useEffect(() => {
    const programId = form.watch('program_id');
    if (programId && programs.length > 0) {
      const program = programs.find(p => p.id === programId);
      setSelectedProgram(program);
    }
  }, [form.watch('program_id'), programs]);

  if (!user) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Please log in to create an application.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Application</h1>
        <p className="text-muted-foreground mt-2">
          Apply to your dream study abroad program
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Details
              </CardTitle>
              <CardDescription>
                Select a program and provide additional information for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="program_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading programs...
                              </SelectItem>
                            ) : (
                              programs.map((program) => (
                                <SelectItem key={program.id} value={program.id}>
                                  {program.name} - {program.university}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information or specific requests..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitApplication.isPending}
                  >
                    {submitApplication.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Application
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[85%]"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to improve application success
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Program Preview */}
          {selectedProgram && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Selected Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedProgram.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProgram.university}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProgram.city}, {selectedProgram.country}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{selectedProgram.duration_months} months</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level:</span>
                    <p className="font-medium">{selectedProgram.study_level}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Tuition:</span>
                  <p className="font-medium">
                    {formatCurrency(selectedProgram.tuition_min)} - {formatCurrency(selectedProgram.tuition_max)}
                  </p>
                </div>

                {selectedProgram.application_fee && (
                  <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                    <CreditCard className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      Application fee: {formatCurrency(selectedProgram.application_fee)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Create application</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Upload required documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Submit application</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Pay application fee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
