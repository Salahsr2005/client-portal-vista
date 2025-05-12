
import React from 'react';
import { ConsultationFlow } from '@/components/consultation/ConsultationFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Consultation() {
  useEffect(() => {
    // Initialize consultation data or setup any necessary state
    console.log('Consultation page loaded');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-6xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Personalized Program Matcher</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about your academic goals and preferences to receive tailored program recommendations
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl">Find Your Perfect Academic Path</CardTitle>
          <CardDescription>
            Our advanced matching algorithm will identify programs that best suit your needs and goals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ConsultationFlow />
        </CardContent>
      </Card>
    </motion.div>
  );
}
