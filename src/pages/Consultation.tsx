
import React from 'react';
import { ConsultationFlow } from '@/components/consultation/ConsultationFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFavoriteProgramsTable } from '@/utils/databaseHelpers';
import { useEffect } from 'react';

const Consultation = () => {
  // Initialize the favorites table when the component mounts
  useEffect(() => {
    createFavoriteProgramsTable();
  }, []);

  return (
    <div className="container py-8 mx-auto max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Program Consultation</CardTitle>
          <CardDescription>
            Find the perfect educational program that matches your preferences and requirements.
            Our advanced matching algorithm will recommend programs with the best fit based on factors
            like budget, field of study, location, language, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultationFlow />
        </CardContent>
      </Card>
    </div>
  );
};

export default Consultation;
