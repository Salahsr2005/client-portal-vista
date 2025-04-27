
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  CircleDashed,
  PlusCircle,
  FileSearch,
  AlertTriangle,
  RotateCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ApplicationStatus = "Completed" | "Draft" | "Submitted" | "In Review" | "Pending Documents" | "Approved" | "Rejected" | "Cancelled";

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let icon = null;
  
  switch(status) {
    case "Approved":
      variant = "default";
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
      break;
    case "Pending Documents":
    case "In Review":
    case "Submitted":
      variant = "secondary";
      icon = <Clock className="h-4 w-4 mr-1" />;
      break;
    case "Rejected":
    case "Cancelled":
      variant = "destructive";
      icon = <XCircle className="h-4 w-4 mr-1" />;
      break;
    default:
      variant = "outline";
      icon = <CircleDashed className="h-4 w-4 mr-1" />;
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status}
    </Badge>
  );
};

const ApplicationCard = ({ application, onClick }: { application: any, onClick: () => void }) => {
  return (
    <Card className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {application.program_name}
        </CardTitle>
        <StatusBadge status={application.status} />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Submitted on {new Date(application.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Applications() {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          programs (
            name, 
            university, 
            study_level, 
            program_language, 
            country
          )
        `)
        .eq("client_id", user.id);
        
      if (error) throw error;
      
      // Transform data to include program name and other details
      return data.map(app => ({
        ...app,
        program_name: app.programs?.name || "Unknown Program",
        university: app.programs?.university || "Unknown University",
        study_level: app.programs?.study_level || "Unknown Level",
        language: app.programs?.program_language || "Unknown Language",
        country: app.programs?.country || "Unknown Location"
      }));
    },
    enabled: !!user
  });
  
  const handleApplicationClick = (application: any) => {
    setSelectedApplication(application);
    console.log("Clicked application:", application);
  };
  
  const renderApplicationGroups = () => {
    if (!user) {
      return (
        <div className="text-center py-10">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Login Required</h3>
          <p className="text-sm text-muted-foreground mb-4">Please log in to view your applications.</p>
          <Button asChild>
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="flex flex-col space-y-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-60 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-5 w-40 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-1">Error loading applications</h3>
          <p className="text-sm text-muted-foreground mb-4">There was a problem loading your applications.</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      );
    }
    
    if (!applications?.length) {
      return (
        <div className="text-center py-10">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No applications yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start your first application to a program.</p>
          <Button asChild>
            <Link to="/applications/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Application
            </Link>
          </Button>
        </div>
      );
    }
    
    const approved = applications.filter(app => app.status === "Approved");
    const pending = applications.filter(app => ["In Review", "Submitted", "Pending Documents"].includes(app.status));
    const rejected = applications.filter(app => ["Rejected", "Cancelled"].includes(app.status));
    const draft = applications.filter(app => app.status === "Draft");
    
    return (
      <div className="space-y-8">
        {approved.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              Approved Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approved.map(application => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onClick={() => handleApplicationClick(application)}
                />
              ))}
            </div>
          </div>
        )}
        
        {pending.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="text-amber-500 mr-2 h-5 w-5" />
              Pending Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map(application => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onClick={() => handleApplicationClick(application)}
                />
              ))}
            </div>
          </div>
        )}
        
        {rejected.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <XCircle className="text-red-500 mr-2 h-5 w-5" />
              Rejected Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejected.map(application => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onClick={() => handleApplicationClick(application)}
                />
              ))}
            </div>
          </div>
        )}
        
        {draft.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <CircleDashed className="text-muted-foreground mr-2 h-5 w-5" />
              Draft Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.map(application => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onClick={() => handleApplicationClick(application)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your program applications
        </p>
      </div>
      
      {renderApplicationGroups()}
    </div>
  );
}
