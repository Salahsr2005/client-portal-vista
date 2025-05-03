
import React from 'react';
import { X, Heart, Users, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  type?: 'default' | 'selected' | 'favorites';
  message?: string;
  description?: string;
  handlePrevious?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'default',
  message = 'No matching programs found',
  description = 'Try adjusting your preferences or filters to see more results.',
  handlePrevious
}) => {
  const getIcon = () => {
    switch (type) {
      case 'selected':
        return <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />;
      case 'favorites':
        return <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />;
      default:
        return (
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <X className="h-6 w-6 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="py-8 text-center">
        {getIcon()}
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
        {handlePrevious && (
          <Button onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Adjust Preferences
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
