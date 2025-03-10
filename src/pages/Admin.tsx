
import React, { useState } from "react";
import { DataManager } from "@/components/admin/DataManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, RefreshCw, Users, Globe, GraduationCap, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLandingPageData } from "@/hooks/useLandingPageData";

export default function Admin() {
  const { toast } = useToast();
  const { refreshData } = useLandingPageData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    refreshData();
    
    toast({
      title: "Refreshing data",
      description: "The latest content will be reflected on the landing page.",
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleRefreshData} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Website Data"}
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Destinations"
          icon={<Globe className="h-5 w-5 text-blue-500" />}
          value="--"
          description="Active study destinations"
        />
        <StatsCard
          title="Total Programs"
          icon={<GraduationCap className="h-5 w-5 text-green-500" />}
          value="--"
          description="Study programs available"
        />
        <StatsCard
          title="Total Services"
          icon={<FileText className="h-5 w-5 text-purple-500" />}
          value="--"
          description="Services offered"
        />
        <StatsCard
          title="Total Clients"
          icon={<Users className="h-5 w-5 text-orange-500" />}
          value="--"
          description="Registered users"
        />
      </div>
      
      {/* Data Management Tab */}
      <DataManager />
      
      <div className="text-center text-sm text-muted-foreground mt-10">
        <p>
          This is the admin dashboard for Euro Visa. Here you can manage all the content that appears on your website.
        </p>
        <p className="mt-1">
          Any changes made here will be reflected on your website after refreshing the data.
        </p>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
}

function StatsCard({ title, icon, value, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
