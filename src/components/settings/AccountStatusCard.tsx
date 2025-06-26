
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell } from "lucide-react";

interface AccountStatusCardProps {
  profileStatus?: string;
}

export default function AccountStatusCard({ profileStatus }: AccountStatusCardProps) {
  const statusItems = [
    {
      icon: User,
      label: 'Account Type',
      value: profileStatus || 'Incomplete',
      variant: 'default' as const
    },
    {
      icon: Shield,
      label: 'Account Security',
      value: 'Standard',
      variant: 'outline' as const
    },
    {
      icon: Bell,
      label: '2FA Authentication',
      value: 'Not Enabled',
      variant: 'destructive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {statusItems.map((item, index) => (
        <Card key={index} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <Badge variant={item.variant} className="text-xs">
                {item.value}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
