
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceApplications from '@/components/services/ServiceApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Applications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("programs");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      
      <Tabs defaultValue="programs" onValueChange={setActiveTab} className="w-full">
        <div className="mb-8">
          <TabsList className="bg-slate-100 dark:bg-slate-800/40 p-1 h-auto">
            <TabsTrigger 
              value="programs"
              className={`text-sm px-4 py-2 ${activeTab === "programs" ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
            >
              Program Applications
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className={`text-sm px-4 py-2 ${activeTab === "services" ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
            >
              Service Applications
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="programs" className="mt-0">
          <Card className="bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-900/40 dark:to-gray-800/40 rounded-lg p-8 mb-8 text-center">
            <CardContent className="space-y-4 p-0">
              <h2 className="text-2xl font-semibold">Program Applications</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your applications to educational programs around the world.
              </p>
              <Separator className="my-6" />
              <p className="text-gray-500 dark:text-gray-400">
                Program applications functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <ServiceApplications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
