
import React from 'react';
import { useApplications } from '@/hooks/useApplications';
import { Card, CardContent } from '@/components/ui/card';
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
import { GraduationCap, Calendar, FileText, MapPin, Clock, Check, FileX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProgramApplications = () => {
  const { data: applications = [], isLoading, error } = useApplications();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'under review':
        return 'bg-amber-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
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
      <Card>
        <CardContent className="p-6 text-center">
          <FileX className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error Loading Applications</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Failed to load your program applications"}
          </p>
          <Button variant="outline" className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-900/40 dark:to-gray-800/40 rounded-lg p-8 text-center">
        <CardContent className="space-y-4 p-0">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">No Program Applications Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't applied to any educational programs yet.
          </p>
          <Button className="mt-4">
            Apply to a Program
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Program Applications</h3>
          <p className="text-sm text-muted-foreground">
            Track the status of your educational program applications
          </p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Apply New
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      {app.program}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {app.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(app.status)} text-white`}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {app.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {app.lastUpdated}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProgramApplications;
