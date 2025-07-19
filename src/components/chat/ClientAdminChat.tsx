
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminSelection from './AdminSelection';
import RealtimeChat from './RealtimeChat';
import { Admin } from '@/hooks/useAvailableAdmins';

export default function ClientAdminChat() {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleSelectAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
  };

  const handleBackToSelection = () => {
    setSelectedAdmin(null);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-none">
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedAdmin ? `Chat with ${selectedAdmin.full_name}` : 'Support Chat'}
            </CardTitle>
            {selectedAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSelection}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {selectedAdmin ? (
            <RealtimeChat selectedAdmin={selectedAdmin} />
          ) : (
            <div className="p-6 flex-1">
              <AdminSelection onSelectAdmin={handleSelectAdmin} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
