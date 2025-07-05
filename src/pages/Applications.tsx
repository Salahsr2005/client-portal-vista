
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceApplications from '@/components/services/ServiceApplications';
import ProgramApplications from '@/components/programs/ProgramApplications';
import { useAuth } from '@/contexts/AuthContext';
import { ModernApplicationCard } from '@/components/applications/ModernApplicationCard';
import { useApplications } from '@/hooks/useApplications';
import { useDestinationApplications } from '@/hooks/useDestinationApplications';
import { useServiceApplications } from '@/hooks/useServices';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Applications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isMobile = useIsMobile();

  const { data: programApplications = [] } = useApplications();
  const { data: destinationApplications = [] } = useDestinationApplications();
  const { data: serviceApplicationsData = [] } = useServiceApplications();

  // Transform and combine all applications
  const allApplications = [
    ...programApplications.map(app => ({
      id: app.id || 'prog-' + Math.random(),
      type: 'program' as const,
      title: `Program Application`,
      subtitle: app.program || 'Program',
      status: app.status || 'Draft',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: app.status === 'Approved' ? 100 : app.status === 'Under Review' ? 70 : 30,
      paymentStatus: 'Pending'
    })),
    ...destinationApplications.map(app => ({
      id: app.id,
      type: 'destination' as const,
      title: 'Destination Application',
      subtitle: app.destinations?.name || app.destination_id,
      status: app.status,
      priority: app.priority,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      progress: app.status === 'Approved' ? 100 : app.status === 'Under Review' ? 70 : 30,
      paymentStatus: app.payment_status,
      location: app.destinations?.country || app.program_level,
      imageUrl: '/placeholder.svg'
    })),
    ...serviceApplicationsData.map(app => ({
      id: app.id,
      type: 'service' as const,
      title: app.services?.name || 'Service Application',
      subtitle: app.services?.description || 'Service request',
      status: app.status,
      priority: 'Medium',
      createdAt: app.created_at,
      updatedAt: app.updated_at || app.created_at,
      progress: app.status === 'Completed' ? 100 : app.status === 'In Progress' ? 60 : 30,
      paymentStatus: app.payment_status,
      fee: app.services?.price || 0
    }))
  ];

  // Filter applications
  const filteredApplications = allApplications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.subtitle && app.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTab = activeTab === 'all' || app.type === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleViewApplication = (id: string) => {
    // Navigate to application details
    console.log('View application:', id);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all your program, destination, and service applications
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All ({allApplications.length})
          </TabsTrigger>
          <TabsTrigger value="program" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Programs</span>
            <span className="sm:hidden">Prog</span> ({programApplications.length})
          </TabsTrigger>
          <TabsTrigger value="destination" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Destinations</span>
            <span className="sm:hidden">Dest</span> ({destinationApplications.length})
          </TabsTrigger>
          <TabsTrigger value="service" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Services</span>
            <span className="sm:hidden">Serv</span> ({serviceApplicationsData.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4 px-4">
                {searchTerm || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "You haven't submitted any applications yet"}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? `grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'}`
                : 'space-y-3'
            }>
              {filteredApplications.map((application) => (
                <ModernApplicationCard
                  key={application.id}
                  application={application}
                  onView={handleViewApplication}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
