
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePayments } from "@/hooks/usePayments";
import { usePendingApplications } from "@/hooks/usePayments";
import { format } from "date-fns";

const Payments = () => {
  const { data: payments = [], isLoading, error } = usePayments();
  const { data: pendingApplications = [], isLoading: isLoadingPending } = usePendingApplications();
  const [pendingItem, setPendingItem] = useState<any>(null);
  const [pendingType, setPendingType] = useState<string>("");

  const handlePendingItemClick = (item: any, type: string) => {
    setPendingItem(item);
    setPendingType(type);
  };

  // Add this function to safely handle potentially missing properties
  const getProgramDetails = (app: any) => {
    return {
      programName: app.name || app.programName || "Program Fee", 
      university: app.provider || app.university || "", 
      applicationFee: app.fee || 0
    };
  };

  if (isLoading || isLoadingPending) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your payments...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Review your payment history and pending payments</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <p className="font-medium">${payment.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No payment history available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Select an item to pay for</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length > 0 ? (
            <div className="space-y-4">
              {pendingApplications.map((item) => (
                <div key={item.id} className="flex justify-between items-center cursor-pointer" onClick={() => handlePendingItemClick(item, 'program')}>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.provider}</p>
                  </div>
                  <p className="font-medium">${item.fee}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending payments available.</p>
          )}
        </CardContent>
      </Card>

      {pendingItem && (
        <div className="mt-4">
          {pendingType === 'program' && (
            <div className="flex flex-col space-y-2">
              {/* Use the safe accessor function */}
              <p className="font-medium">{getProgramDetails(pendingItem).programName}</p>
              <p className="text-sm text-muted-foreground">{getProgramDetails(pendingItem).university}</p>
              <p className="text-sm font-medium mt-1">${getProgramDetails(pendingItem).applicationFee.toFixed(2)}</p>
              <Button>Pay Now</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
