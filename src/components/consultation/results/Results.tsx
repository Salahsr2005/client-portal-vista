
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FormData } from '../types';

interface ResultsProps {
  formData: FormData;
}

const Results = ({ formData }: ResultsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground mt-2">
            Your preferences have been saved successfully
          </p>
        </div>
        
        <div className="bg-muted p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">Your Preferences</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Study Level:</span>
              <span className="font-medium">{formData.level}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Field of Study:</span>
              <span className="font-medium">{formData.subjects?.join(', ') || formData.subject}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-medium">{typeof formData.budget === 'number' ? 
                `€${formData.budget.toLocaleString()}` : formData.budget}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-medium">{formData.destination || formData.location}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <span className="font-medium">{formData.language}</span>
            </li>
          </ul>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          An advisor will review your preferences and get in touch with personalized program recommendations.
        </p>
      </CardContent>
    </Card>
  );
};

export default Results;
