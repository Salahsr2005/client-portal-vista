import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { List, ListItem } from "@/components/ui/list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ApplicationView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: applications, isLoading } = useApplications();
  const [formData, setFormData] = useState({
    program_id: '',
    personal_statement: '',
    transcript_path: '',
    additional_documents_path: '',
    agreed_to_terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if the application exists
  const application = applications?.find(app => app.application_id === id);
  
  // Check if the user has an approved application
  const hasApprovedOrReviewingApplication = applications?.some(app => 
    app.status.toLowerCase() === 'approved' || app.status.toLowerCase() === 'in review'
  );
  
  useEffect(() => {
    if (application) {
      setFormData({
        program_id: application.program_id || '',
        personal_statement: application.personal_statement || '',
        transcript_path: application.transcript_path || '',
        additional_documents_path: application.additional_documents_path || '',
        agreed_to_terms: application.agreed_to_terms || false,
      });
    }
  }, [application]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your application",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.agreed_to_terms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (application) {
        // Update existing application
        const { error } = await supabase
          .from('applications')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('application_id', id);
          
        if (error) throw error;
        
        toast({
          title: "Application updated",
          description: "Your application has been updated successfully",
        });
      } else {
        // Create new application
        const { error } = await supabase
          .from('applications')
          .insert({
            ...formData,
            client_id: user.id,
            status: 'Pending'
          });
          
        if (error) throw error;
        
        toast({
          title: "Application submitted",
          description: "Your application has been submitted successfully",
        });
      }
      
      // Redirect to applications page
      navigate('/applications');
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view and submit applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (hasApprovedOrReviewingApplication) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Application Submitted</CardTitle>
            <CardDescription>You have already submitted an application and it is under review. You cannot submit another application at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/applications')}>View Applications</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{application ? 'Update Application' : 'Submit Application'}</CardTitle>
          <CardDescription>Fill out the form below to submit your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="program_id">Program ID</Label>
              <Input 
                type="text" 
                id="program_id" 
                name="program_id" 
                value={formData.program_id} 
                onChange={handleChange} 
                placeholder="Enter program ID" 
              />
            </div>
            <div>
              <Label htmlFor="personal_statement">Personal Statement</Label>
              <Textarea 
                id="personal_statement" 
                name="personal_statement" 
                value={formData.personal_statement} 
                onChange={handleChange} 
                placeholder="Write your personal statement" 
              />
            </div>
            <div>
              <Label htmlFor="transcript_path">Transcript Path</Label>
              <Input 
                type="text" 
                id="transcript_path" 
                name="transcript_path" 
                value={formData.transcript_path} 
                onChange={handleChange} 
                placeholder="Enter transcript path" 
              />
            </div>
            <div>
              <Label htmlFor="additional_documents_path">Additional Documents Path</Label>
              <Input 
                type="text" 
                id="additional_documents_path" 
                name="additional_documents_path" 
                value={formData.additional_documents_path} 
                onChange={handleChange} 
                placeholder="Enter additional documents path" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreed_to_terms" 
                  name="agreed_to_terms" 
                  checked={formData.agreed_to_terms} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreed_to_terms: !!checked }))}
                />
                <Label htmlFor="agreed_to_terms">I agree to the terms and conditions</Label>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                application ? 'Update Application' : 'Submit Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
