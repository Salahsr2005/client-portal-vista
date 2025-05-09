
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceApplications from '@/components/services/ServiceApplications';
import ProgramApplications from '@/components/programs/ProgramApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export default function Applications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("programs");

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-2">My Applications</h1>
      <p className="text-muted-foreground mb-6">View and manage all your applications in one place</p>
      
      <Tabs defaultValue="programs" onValueChange={setActiveTab} className="w-full">
        <div className="mb-8">
          <TabsList className="bg-slate-100 dark:bg-slate-800/40 p-1 h-auto">
            <TabsTrigger 
              value="programs"
              className={`text-sm px-4 py-2 ${activeTab === "programs" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
            >
              Program Applications
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className={`text-sm px-4 py-2 ${activeTab === "services" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
            >
              Service Applications
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="programs" className="mt-0">
          <ProgramApplications />
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <ServiceApplications />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
