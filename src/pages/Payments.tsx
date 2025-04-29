import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Receipt, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Calendar,
  ChevronRight,
  DollarSign
} from "lucide-react";

// Mock data for payments
const paymentHistory = [
  {
    id: "INV-001",
    date: "2023-08-15",
    amount: 250,
    status: "Paid",
    description: "Application Fee - Harvard University",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-002",
    date: "2023-07-28",
    amount: 150,
    status: "Paid",
    description: "Document Verification Service",
    paymentMethod: "MasterCard •••• 5555",
  },
  {
    id: "INV-003",
    date: "2023-06-10",
    amount: 500,
    status: "Paid",
    description: "Premium Consultation Package",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV-004",
    date: "2023-05-22",
    amount: 75,
    status: "Pending",
    description: "Express Processing Fee",
    paymentMethod: "Pending Payment",
  }
];

// Mock data for invoices
const invoices = [
  {
    id: "INV-005",
    date: "2023-09-01",
    dueDate: "2023-09-15",
    amount: 350,
    status: "Unpaid",
    description: "University Application Support - Stanford",
  },
  {
    id: "INV-006",
    date: "2023-08-25",
    dueDate: "2023-09-10",
    amount: 200,
    status: "Unpaid",
    description: "Visa Consultation Services",
  }
];

// Mock data for subscription
const subscription = {
  plan: "Premium Support",
  status: "Active",
  nextBilling: "2023-09-15",
  amount: 49.99,
  features: [
    "Unlimited application support",
    "Priority document processing",
    "24/7 advisor access",
    "Monthly strategy sessions"
  ]
};

const Payments = () => {
  const [activeTab, setActiveTab] = useState("history");

  // Fix the math operation
  const calculateTotal = (price: number | string, quantity: number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice * quantity;
  };

  // Calculate total paid
  const totalPaid = paymentHistory
    .filter(payment => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate total due
  const totalDue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments & Billing</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Make a Payment
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {paymentHistory.filter(p => p.status === "Paid").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.length} unpaid {invoices.length === 1 ? "invoice" : "invoices"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscription.amount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Due on {subscription.nextBilling}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            View and manage your payment history, invoices, and subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="space-y-4">
              <div className="rounded-md border">
                <div className="py-3 px-4 text-sm font-medium grid grid-cols-5 bg-muted/50">
                  <div>Invoice</div>
                  <div>Date</div>
                  <div>Description</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="py-3 px-4 text-sm grid grid-cols-5 items-center">
                      <div className="font-medium">{payment.id}</div>
                      <div>{payment.date}</div>
                      <div>{payment.description}</div>
                      <div>${payment.amount.toFixed(2)}</div>
                      <div>
                        <Badge variant={payment.status === "Paid" ? "success" : "outline"}>
                          {payment.status === "Paid" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Receipts
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="invoices" className="space-y-4">
              {invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{invoice.id}</CardTitle>
                          <Badge variant="destructive">
                            {invoice.status}
                          </Badge>
                        </div>
                        <CardDescription>{invoice.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Issue Date</p>
                            <p className="font-medium">{invoice.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="font-medium">{invoice.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Invoice
                        </Button>
                        <Button size="sm">
                          Pay Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Outstanding Invoices</h3>
                  <p className="text-muted-foreground">You don't have any unpaid invoices at the moment.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{subscription.plan}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100">
                      {subscription.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Your subscription renews on {subscription.nextBilling}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Fee</p>
                      <p className="text-2xl font-bold">${subscription.amount.toFixed(2)}</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="space-y-2">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Visa ending in 4242</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                    Cancel Subscription
                  </Button>
                  <Button>
                    <Receipt className="mr-2 h-4 w-4" />
                    Billing History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
