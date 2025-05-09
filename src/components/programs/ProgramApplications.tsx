
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, FileText, MapPin, Clock, CheckCircle, FileX, PlusCircle, RefreshCw, CircleDollarSign, History, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserPaymentStatus } from '@/hooks/useUserPaymentStatus';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const ProgramApplications = () => {
  const navigate = useNavigate();
  const { data: applications = [], isLoading, error, refetch } = useApplications();
  const { data: paymentStatus, isLoading: paymentLoading } = useUserPaymentStatus();
  
  const isAllowedToApply = paymentStatus?.isPaid || paymentStatus?.hasPendingReceipt;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-slate-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'under review':
        return 'bg-amber-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <FileText className="h-4 w-4 text-slate-100" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-blue-100" />;
      case 'under review':
        return <Clock className="h-4 w-4 text-amber-100" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-100" />;
      case 'rejected':
        return <FileX className="h-4 w-4 text-red-100" />;
      default:
        return <FileText className="h-4 w-4 text-slate-100" />;
    }
  };
  
  const handleNewApplication = () => {
    navigate('/applications/new');
  };

  if (isLoading || paymentLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium">Error Loading Applications</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Failed to load your program applications"}
            </p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-200 hover:bg-red-50 text-red-600" 
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium">Your Program Applications</h3>
          <p className="text-sm text-muted-foreground">
            Track the status of your educational program applications
          </p>
        </div>
        
        <Button 
          onClick={handleNewApplication} 
          disabled={!isAllowedToApply}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>
      
      {!isAllowedToApply && (
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 mb-6 shadow-sm">
          <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full mr-4">
            <CircleDollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <AlertDescription>
            <span className="font-medium text-amber-800 dark:text-amber-400">Payment Required</span>
            <p className="text-sm text-amber-700 dark:text-amber-500">
              You need to complete payment before submitting new applications. 
              <Button variant="link" className="p-0 h-auto text-amber-800 dark:text-amber-400 underline decoration-amber-300 decoration-2 underline-offset-2 hover:text-amber-900" onClick={() => navigate('/payments')}>
                Go to Payments
              </Button>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {applications.length === 0 ? (
        <Card className="border-0 bg-gradient-to-r from-indigo-50 to-slate-50 dark:from-gray-900 dark:to-indigo-900/20 shadow-md rounded-xl overflow-hidden">
          <CardContent className="space-y-4 p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold">No Program Applications Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              You haven't applied to any educational programs yet. Discover available programs and start your application today.
            </p>
            {isAllowedToApply && (
              <Button 
                className="mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md"
                onClick={handleNewApplication}
              >
                Get Started
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pb-0 bg-gradient-to-r from-indigo-50/50 to-slate-50/50 dark:from-indigo-950/20 dark:to-slate-950/20">
            <CardTitle className="text-lg flex items-center">
              <History className="h-5 w-5 mr-2 text-indigo-500" />
              Applications ({applications.length})
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                  <TableHead>Program</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                          <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {app.program}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        {app.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(app.status)} text-white shadow-sm flex items-center gap-1.5 px-2.5 py-1`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        {app.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        {app.lastUpdated}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/applications/${app.id}`)}
                        className="border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </motion.div>
  );
};

export default ProgramApplications;
