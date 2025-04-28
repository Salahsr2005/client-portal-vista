
import React, { useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Search, Building, Calendar, Clock, AlertCircle, CheckCircle, DollarSign, Filter, ChevronsUpDown, Building2 } from 'lucide-react';

function PaymentStats({ payments }: { payments: any[] }) {
  // Convert the amount to a number before calculations
  const totalPaid = payments.reduce((sum, payment) => 
    payment.status === 'Completed' ? sum + Number(payment.amount) : sum, 0);
  
  const pendingPayments = payments.filter(payment => payment.status === 'Pending').length;
  
  const paymentMethods = payments.reduce((acc: Record<string, number>, payment) => {
    if (payment.status === 'Completed') {
      acc[payment.method] = (acc[payment.method] || 0) + 1;
    }
    return acc;
  }, {});

  const topMethod = Object.entries(paymentMethods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingPayments}</div>
          <p className="text-xs text-muted-foreground">
            {pendingPayments > 0 ? 'Awaiting processing' : 'No pending payments'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Preferred Payment Method</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topMethod}</div>
          <p className="text-xs text-muted-foreground">
            {Object.entries(paymentMethods).length} method(s) used
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentsPage() {
  const { data: payments, isLoading, error } = usePayments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" /> Error Loading Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading your payment information. Please try again later.</p>
            <Button variant="outline" className="mt-4">Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApplications = payments?.filter(payment => 
    payment.status === 'Pending' && payment.applicationId
  ) || [];

  const filteredPayments = payments?.filter(payment => {
    // Filter by search term
    const matchesSearch = 
      !searchTerm ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">Manage your payments and payment methods</p>
      </div>

      {/* Payment Statistics */}
      <PaymentStats payments={payments || []} />

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <Card className="mt-8 border-2">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              Pending Applications Requiring Payment
            </CardTitle>
            <CardDescription>
              Applications that require payment to proceed to the next step
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pendingApplications.map((payment) => (
                <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-medium">{payment.description || 'Application Payment'}</h3>
                    <p className="text-sm text-muted-foreground">Due: {new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
                    <div className="text-lg font-semibold md:mr-4">${payment.amount}</div>
                    <Button onClick={() => setDialogOpen(true)}>Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your payment history and transaction details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            {filteredPayments.length === 0 ? (
              <div className="py-12 px-4 text-center text-muted-foreground">
                <p>No payments found</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs border-b bg-muted">
                    <tr>
                      <th className="px-6 py-3">Reference</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Method</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{payment.transactionId}</div>
                          <div className="text-xs text-muted-foreground">{payment.description || 'Payment'}</div>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {payment.method || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method and complete your payment.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="card" className="pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="ccp">Algeria CCP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input placeholder="**** **** **** ****" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <Input placeholder="***" />
                  </div>
                </div>
                <Button className="w-full">Pay Securely</Button>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                Your payment information is encrypted and secure.
              </div>
            </TabsContent>
            
            <TabsContent value="bank" className="space-y-4 pt-4">
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                <div>
                  <div className="text-sm font-medium">Bank Transfer Instructions</div>
                  <div className="text-sm">Transfer the amount to the following account:</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Bank:</div>
                    <div className="font-medium">BDL-AGB-CPA</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Account Number:</div>
                    <div className="font-medium">00721 7474 3847 6274 91</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Beneficiary:</div>
                    <div className="font-medium">Education Agency Ltd</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reference:</div>
                    <div className="font-medium">PMT-{Math.floor(Math.random() * 10000)}</div>
                  </div>
                </div>
              </div>
              <Button className="w-full">I've Completed The Transfer</Button>
            </TabsContent>
            
            <TabsContent value="ccp" className="space-y-4 pt-4">
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                <div>
                  <div className="text-sm font-medium">Algeria CCP Payment</div>
                  <div className="text-sm">Make a payment to our CCP account:</div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">CCP Account Number:</div>
                    <div className="font-medium">00721 999 0003 4321 76</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Key:</div>
                    <div className="font-medium">45</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Beneficiary Name:</div>
                    <div className="font-medium">Education Agency Algeria</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Payment Receipt (Optional)</label>
                <Input type="file" />
              </div>
              <Button className="w-full">Confirm Payment</Button>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
