import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface ModernApplicationCardProps {
  application: {
    id: string;
    type: 'program' | 'destination' | 'service';
    title: string;
    subtitle?: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    progress?: number;
    imageUrl?: string;
    location?: string;
    paymentStatus?: string;
    fee?: number;
    deadline?: string;
  };
  onView: (id: string) => void;
}

export const ModernApplicationCard: React.FC<ModernApplicationCardProps> = ({ 
  application, 
  onView 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending':
      case 'in review':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'draft':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'in review':
        return <AlertCircle className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    // Return placeholder for now, images should come from database
    return '';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md hover:shadow-2xl w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                <AvatarImage 
                  src={application.imageUrl || '/placeholder.svg'} 
                  alt={application.title}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-semibold text-lg">
                  {application.type === 'program' ? 'PR' : 
                   application.type === 'destination' ? 'DE' : 'SE'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">
                  {application.type === 'program' ? 'P' : 
                   application.type === 'destination' ? 'D' : 'S'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                {application.title}
              </CardTitle>
              {application.subtitle && (
                <p className="text-sm text-gray-600 truncate mt-1">{application.subtitle}</p>
              )}
              {application.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">{application.location}</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={`${getPriorityColor(application.priority)} text-xs font-medium shrink-0`}>
            {application.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
              {getStatusIcon(application.status)}
              <span className="text-xs font-medium">{application.status}</span>
            </Badge>
            {application.paymentStatus && (
              <Badge variant="outline" className="text-xs">
                💳 {application.paymentStatus}
              </Badge>
            )}
          </div>
          
          {application.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{application.progress}%</span>
              </div>
              <Progress value={application.progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Applied: {format(new Date(application.createdAt), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Updated: {format(new Date(application.updatedAt), 'MMM dd')}</span>
          </div>
          {application.fee && (
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium">${application.fee}</span>
            </div>
          )}
          {application.deadline && (
            <div className="flex items-center space-x-2 text-orange-600">
              <span className="truncate">Deadline: {format(new Date(application.deadline), 'MMM dd')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Button 
            onClick={() => onView(application.id)}
            size="sm" 
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span className="truncate">View Details</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-gray-50 border-gray-200 sm:px-3 sm:flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4 sm:mr-0 mr-2" />
            <span className="sm:hidden">External Link</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};