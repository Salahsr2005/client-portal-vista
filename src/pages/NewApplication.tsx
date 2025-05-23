
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Program } from "@/types/Program";

// Create a hook for application submission
const useApplicationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitApplication = async ({ 
    programId, 
    notes, 
    priority 
  }: { 
    programId: string; 
    notes: string; 
    priority: 'High' | 'Medium' | 'Low' 
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      return null;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          client_id: user.id,
          program_id: programId,
          notes,
          priority,
          status: 'Draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('application_id')
        .single();

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });

      return { success: true, applicationId: data.application_id };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting };
};

export default function NewApplication() {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitApplication, isSubmitting } = useApplicationSubmit();

  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { data: program, isLoading, error } = useQuery({
    queryKey: ['program', programId],
    queryFn: async () => {
      if (!programId) throw new Error("Program ID is required");
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single();

      if (error) throw error;
      return data as Program;
    },
    enabled: !!programId,
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!programId) {
      toast({
        title: "Error",
        description: "Program ID is missing. Please select a program.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "You must accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    const result = await submitApplication({
      programId: programId,
      notes: notes,
      priority: priority,
    });

    if (result?.success) {
      navigate(`/applications/${result.applicationId}`);
    }
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="container max-w-3xl py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/applications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
      </Button>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-1/4" />
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load program details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">New Application</CardTitle>
            <CardDescription>Apply for the {program?.name} program.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="program-name">Program Name</Label>
              <Input id="program-name" value={program?.name || "N/A"} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" value={program?.university || "N/A"} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes for your application"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <RadioGroup defaultValue={priority} className="flex flex-col space-y-1" onValueChange={(value) => setPriority(value as 'High' | 'Medium' | 'Low')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="priority-high" />
                  <Label htmlFor="priority-high">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="priority-medium" />
                  <Label htmlFor="priority-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="priority-low" />
                  <Label htmlFor="priority-low">Low</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={(checked) => setTermsAccepted(!!checked)} />
              <Label htmlFor="terms">I accept the terms and conditions</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
