
import React from 'react';
import { ConsultationFlow } from '@/components/consultation/ConsultationFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFavoriteProgramsTable } from '@/utils/databaseHelpers';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Consultation = () => {
  // Initialize the favorites table when the component mounts
  useEffect(() => {
    createFavoriteProgramsTable();
  }, []);

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 shadow-lg border-none bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Program Consultation
            </CardTitle>
            <CardDescription className="text-gray-700">
              Find the perfect educational program that matches your preferences and requirements.
              Our advanced matching algorithm will recommend programs with the best fit based on factors
              like budget, field of study, location, language, and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ConsultationFlow />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Consultation;
