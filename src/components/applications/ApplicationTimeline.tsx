
import React from 'react';
import { CheckCircle, Clock, X } from 'lucide-react';

interface TimelineEvent {
  date: string;
  status: string;
  note?: string;
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ events, currentStatus }) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Application Timeline</h3>
      <div className="space-y-4">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(event.status)}</div>
              <div>
                <p className="font-medium">{event.status}</p>
                {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No timeline events found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
