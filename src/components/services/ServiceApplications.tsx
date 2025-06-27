import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveTabs,
  ResponsiveTabsContent,
  ResponsiveTabsList,
  ResponsiveTabsTrigger,
} from "@/components/ui/responsive-tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useServiceApplications } from '@/hooks/useServices';
import { Clock, CalendarDays, CheckCircle, AlertCircle, HelpCircle, CreditCard, FileText, CircleDollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";

const ServiceApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: applications = [], isLoading, error } = useServiceApplications();
  const [detailService, setDetailService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (application: any) => {
    setDetailService(application);
    setDialogOpen(true);
  };

  const handlePay = (application: any) => {
    navigate(`/payments/new?type=service&id=${application.id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Applications</CardTitle>
          <CardDescription>Error loading your service applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="font-medium text-lg mb-1">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mb-4">We couldn't load your service applications</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Applications</CardTitle>
          <CardDescription>You haven't applied for any services yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg mb-2">No applications found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Browse our services and apply for the ones that interest you
            </p>
            <Button asChild>
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-md bg-white dark:bg-gray-950">
        <CardHeader className={`bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-900/40 dark:to-gray-800/40 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Service Applications</CardTitle>
              <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
                Track the status of your service applications
              </CardDescription>
            </div>
            <Button 
              className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600" 
              asChild
              size={isMobile ? "sm" : "default"}
            >
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "p-2" : "p-6"}>
          <ResponsiveTabs defaultValue="all">
            <ResponsiveTabsList className="mb-6 bg-slate-100 dark:bg-slate-800/40">
              <ResponsiveTabsTrigger value="all">All</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="pending">Pending</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="in-progress">In Progress</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="completed">Completed</ResponsiveTabsTrigger>
            </ResponsiveTabsList>
            
            <ResponsiveTabsContent value="all">
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app.id} className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{app.services?.name}</h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Applied on {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusBadge(app.payment_status)}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(app)}
                        >
                          Details
                        </Button>
                        {app.payment_status.toLowerCase() === "pending" && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-violet-500 to-indigo-500"
                            onClick={() => handlePay(app)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Duration: {app.services?.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Price: ${app.services?.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Est. Completion: {app.services?.estimated_completion || "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {app.notes ? "Has notes" : "No notes"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="pending">
              <div className="space-y-4">
                {applications.filter((app: any) => app.status.toLowerCase() === 'pending').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                ) : (
                  applications
                    .filter((app: any) => app.status.toLowerCase() === 'pending')
                    .map((app: any) => (
                      <div key={app.id} className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{app.services?.name}</h3>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Applied on {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPaymentStatusBadge(app.payment_status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(app)}
                            >
                              Details
                            </Button>
                            {app.payment_status.toLowerCase() === "pending" && (
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-violet-500 to-indigo-500"
                                onClick={() => handlePay(app)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Duration: {app.services?.duration} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Price: ${app.services?.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Est. Completion: {app.services?.estimated_completion || "TBD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {app.notes ? "Has notes" : "No notes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="in-progress">
              <div className="space-y-4">
                {applications.filter((app: any) => app.status.toLowerCase() === 'in progress').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No in-progress applications</p>
                  </div>
                ) : (
                  applications
                    .filter((app: any) => app.status.toLowerCase() === 'in progress')
                    .map((app: any) => (
                      <div key={app.id} className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{app.services?.name}</h3>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Applied on {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPaymentStatusBadge(app.payment_status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(app)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Duration: {app.services?.duration} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Price: ${app.services?.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Est. Completion: {app.services?.estimated_completion || "TBD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {app.notes ? "Has notes" : "No notes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="completed">
              <div className="space-y-4">
                {applications.filter((app: any) => app.status.toLowerCase() === 'completed').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No completed applications</p>
                  </div>
                ) : (
                  applications
                    .filter((app: any) => app.status.toLowerCase() === 'completed')
                    .map((app: any) => (
                      <div key={app.id} className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{app.services?.name}</h3>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Applied on {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPaymentStatusBadge(app.payment_status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(app)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Duration: {app.services?.duration} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Price: ${app.services?.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Est. Completion: {app.services?.estimated_completion || "TBD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {app.notes ? "Has notes" : "No notes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ResponsiveTabsContent>
          </ResponsiveTabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Service Application Details</DialogTitle>
            <DialogDescription>
              View full details of your service application
            </DialogDescription>
          </DialogHeader>
          
          {detailService && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Service</h4>
                  <p>{detailService.services?.name}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
                  <div>{getStatusBadge(detailService.status)}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Applied On</h4>
                  <p>{new Date(detailService.created_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Payment Status</h4>
                  <div>{getPaymentStatusBadge(detailService.payment_status)}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Price</h4>
                  <p>${detailService.services?.price}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Duration</h4>
                  <p>{detailService.services?.duration} minutes</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Description</h4>
                  <p className="text-sm">{detailService.services?.description}</p>
                </div>
                {detailService.notes && (
                  <div className="space-y-2 md:col-span-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Your Notes</h4>
                    <p className="text-sm">{detailService.notes}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                {detailService.payment_status.toLowerCase() === "pending" && (
                  <Button 
                    className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                    onClick={() => handlePay(detailService)}
                  >
                    Pay Now
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceApplications;
