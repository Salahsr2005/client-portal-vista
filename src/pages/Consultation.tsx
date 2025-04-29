
import React from 'react';
import { ConsultationFlow } from '@/components/consultation/ConsultationFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Consultation = () => {
  return (
    <div className="container py-8 mx-auto max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Program Consultation</CardTitle>
          <CardDescription>
            Find the perfect educational program that matches your preferences and requirements.
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
