
import React from 'react';
import { CheckCircle, Clock, AlertTriangle, X, CalendarCheck, FileCheck, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

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
      return <CircleDot className="h-6 w-6 text-gray-500" />;
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
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-slate-50/80">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <CircleDot className="h-5 w-5 mr-2 text-indigo-500" />
            Application Timeline
          </h3>
          <Badge className={cn("font-medium shadow-sm", getStatusColor(currentStatus))}>
            {currentStatus}
          </Badge>
        </div>
        
        <div className="relative border-l-2 border-indigo-200 pl-6 pb-2 space-y-8">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "relative",
                index === 0 ? "pt-0" : "pt-2"
              )}
            >
              <div className="absolute -left-[25px] bg-white dark:bg-slate-950 p-1 rounded-full shadow-sm">
                {getStatusIcon(event.status)}
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-300">{event.status}</h4>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">{event.date}</span>
                </div>
                
                {event.note && (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                    {event.note}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {sortedEvents.length === 0 && (
            <div className="py-10 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-3 opacity-80" />
              <h4 className="text-base font-medium text-slate-700 dark:text-slate-300">No Timeline Events</h4>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Your application timeline will appear here once you've submitted an application.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationTimeline;
