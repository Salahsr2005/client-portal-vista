
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpDown, 
  CreditCard, 
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  BanknoteIcon,
  Building2,
  FileText,
  CircleDollarSign,
  PlusCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePayments, usePendingApplications } from "@/hooks/usePayments";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 mr-1" />;
    case "pending":
      return <Clock className="h-4 w-4 mr-1" />;
    case "failed":
      return <XCircle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

export default function Payments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const { data: payments = [], isLoading: isLoadingPayments } = usePayments();
  const { data: pendingApplications = [], isLoading: isLoadingApplications } = usePendingApplications();
  
  // Calculate total amounts
  const totalPaid = payments
    .filter(p => p.status.toLowerCase() === "completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace('$', '')), 0);

  const pendingAmount = payments
    .filter(p => p.status.toLowerCase() === "pending")
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace('$', '')), 0);
  
  // Filter payments based on search term and filter
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.programName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.universityName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && payment.status.toLowerCase() === filter;
  });

  const handlePayNow = (application: any) => {
    setSelectedApplication(application);
    setIsPaymentDialogOpen(true);
  };

  const processPayment = () => {
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed...",
    });
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Your payment of $${selectedApplication.applicationFee} has been processed.`,
      });
      setIsPaymentDialogOpen(false);
      
      // Refresh the data after payment
      // In a real app, this would trigger a backend update
    }, 2000);
  };

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Please log in to view and manage your payments.
          </p>
          <Button onClick={() => navigate("/login")}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {payments.filter(p => p.status.toLowerCase() === "completed").length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {payments.filter(p => p.status.toLowerCase() === "pending").length} pending transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Credit Card, Bank Transfer, Algeria CCP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications Section */}
      {pendingApplications.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Pending Payments for Applications
            </CardTitle>
            <CardDescription>
              The following applications require payment to proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.programName}</TableCell>
                    <TableCell>{app.university}</TableCell>
                    <TableCell>${app.applicationFee}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Payment Required
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handlePayNow(app)}>
                        Pay Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage your payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setFilter("pending")}>Pending</TabsTrigger>
                <TabsTrigger value="failed" onClick={() => setFilter("failed")}>Failed</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                    <DropdownMenuItem>Amount (Highest)</DropdownMenuItem>
                    <DropdownMenuItem>Amount (Lowest)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuItem>Credit Card</DropdownMenuItem>
                    <DropdownMenuItem>Bank Transfer</DropdownMenuItem>
                    <DropdownMenuItem>Algeria CCP</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Amount <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Method</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPayments ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <span className="text-muted-foreground">Loading payment history...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">No payments found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id.slice(0, 8)}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.description}</div>
                              {payment.universityName && (
                                <div className="text-xs text-muted-foreground">{payment.universityName}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{payment.amount}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(payment.status)}`} variant="outline">
                              {getStatusIcon(payment.status)}
                              <span className="capitalize">{payment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {payment.status.toLowerCase() === "completed" && (
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                  </DropdownMenuItem>
                                )}
                                {payment.status.toLowerCase() === "failed" && (
                                  <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                                )}
                                {payment.status.toLowerCase() === "pending" && (
                                  <DropdownMenuItem className="text-destructive">
                                    Cancel Payment
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-5">
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="bg-muted rounded-md p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program:</span>
                  <span className="font-medium">{selectedApplication?.programName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">University:</span>
                  <span>{selectedApplication?.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application Fee:</span>
                  <span className="font-semibold">${selectedApplication?.applicationFee}</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="font-semibold">Select Payment Method</h3>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                <div>
                  <RadioGroupItem value="card" id="payment-card" className="peer sr-only" />
                  <Label 
                    htmlFor="payment-card" 
                    className="flex items-center gap-3 rounded-lg border border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Pay with Visa or Mastercard</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="bank" id="payment-bank" className="peer sr-only" />
                  <Label 
                    htmlFor="payment-bank" 
                    className="flex items-center gap-3 rounded-lg border border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Bank Transfer (BDL-AGB-CPA)</p>
                      <p className="text-sm text-muted-foreground">Pay via bank transfer</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="ccp" id="payment-ccp" className="peer sr-only" />
                  <Label 
                    htmlFor="payment-ccp" 
                    className="flex items-center gap-3 rounded-lg border border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <BanknoteIcon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Algeria CCP</p>
                      <p className="text-sm text-muted-foreground">Pay via Algeria postal service</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={processPayment} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <CircleDollarSign className="mr-2 h-4 w-4" /> 
              Pay ${selectedApplication?.applicationFee}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
