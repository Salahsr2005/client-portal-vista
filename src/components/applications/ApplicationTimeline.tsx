
import React from 'react';
import { CheckCircle, Clock, AlertTriangle, X, CalendarCheck, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface TimelineEvent {
  id: string;
  status: string;
  date: string;
  note?: string;
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'completed':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'pending':
    case 'in review':
      return <Clock className="h-6 w-6 text-amber-500" />;
    case 'rejected':
    case 'cancelled':
      return <X className="h-6 w-6 text-red-500" />;
    case 'pending documents':
      return <FileCheck className="h-6 w-6 text-blue-500" />;
    case 'submitted':
      return <CalendarCheck className="h-6 w-6 text-violet-500" />;
    default:
      return <AlertTriangle className="h-6 w-6 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'in review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending documents':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'submitted':
      return 'bg-violet-100 text-violet-800 border-violet-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ events, currentStatus }) => {
  // Sort events by date, most recent first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Application Timeline</h3>
        <Badge className={cn("font-medium", getStatusColor(currentStatus))}>
          {currentStatus}
        </Badge>
      </div>
      
      <div className="relative border-l-2 border-slate-200 pl-6 pb-2 space-y-6">
        {sortedEvents.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              "relative",
              index === 0 ? "pt-0" : "pt-2"
            )}
          >
            <div className="absolute -left-[25px] bg-white dark:bg-slate-950 p-1">
              {getStatusIcon(event.status)}
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h4 className="font-medium">{event.status}</h4>
                <span className="text-sm text-muted-foreground">{event.date}</span>
              </div>
              
              {event.note && (
                <p className="mt-2 text-sm text-muted-foreground">{event.note}</p>
              )}
            </div>
          </div>
        ))}
        
        {sortedEvents.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No timeline events available
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
