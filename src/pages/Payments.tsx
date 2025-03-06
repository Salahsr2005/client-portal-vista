
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Receipt, Download, FileText, Plus, CheckCircle, Clock, AlertCircle, Search, Filter } from "lucide-react";

// Mock payment data
const payments = [
  {
    id: "payment-001",
    service: "Document Authentication",
    amount: 2500,
    date: "2023-10-12",
    status: "completed",
    method: "Credit Card",
    reference: "AUTH-12345"
  },
  {
    id: "payment-002",
    service: "Visa Consultation",
    amount: 3500,
    date: "2023-10-15",
    status: "completed",
    method: "Bank Transfer",
    reference: "VISA-78901"
  },
  {
    id: "payment-003",
    service: "University Application Fee",
    amount: 5000,
    date: "2023-10-18",
    status: "pending",
    method: "Bank Transfer",
    reference: "UNIV-23456"
  },
  {
    id: "payment-004",
    service: "IELTS Preparation Course",
    amount: 7500,
    date: "2023-10-05",
    status: "completed",
    method: "Credit Card",
    reference: "LANG-34567"
  },
  {
    id: "payment-005",
    service: "CV Review Service",
    amount: 3000,
    date: "2023-09-28",
    status: "cancelled",
    method: "Credit Card",
    reference: "CV-45678",
    reason: "Service no longer needed"
  }
];

// Mock invoices data
const invoices = [
  {
    id: "inv-001",
    service: "Document Authentication",
    amount: 2500,
    date: "2023-10-12",
    dueDate: "2023-10-19",
    status: "paid"
  },
  {
    id: "inv-002",
    service: "Visa Consultation",
    amount: 3500,
    date: "2023-10-15",
    dueDate: "2023-10-22",
    status: "paid"
  },
  {
    id: "inv-003",
    service: "University Application Fee",
    amount: 5000,
    date: "2023-10-18",
    dueDate: "2023-10-25",
    status: "unpaid"
  },
  {
    id: "inv-004",
    service: "IELTS Preparation Course",
    amount: 7500,
    date: "2023-10-05",
    dueDate: "2023-10-12",
    status: "paid"
  },
  {
    id: "inv-005",
    service: "CV Review Service",
    amount: 3000,
    date: "2023-09-28",
    dueDate: "2023-10-05",
    status: "cancelled"
  }
];

// Payment methods
const savedPaymentMethods = [
  {
    id: "pm-001",
    type: "Credit Card",
    last4: "4242",
    expiry: "04/25",
    brand: "Visa",
    default: true
  },
  {
    id: "pm-002",
    type: "Bank Account",
    bank: "Bank of Algeria",
    last4: "7890",
    default: false
  }
];

const PaymentRow = ({ payment }: { payment: any }) => {
  let statusBadge;
  
  switch (payment.status) {
    case "completed":
      statusBadge = <Badge className="bg-green-500">Completed</Badge>;
      break;
    case "pending":
      statusBadge = <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      break;
    case "cancelled":
      statusBadge = <Badge variant="destructive">Cancelled</Badge>;
      break;
    default:
      statusBadge = <Badge variant="outline">Unknown</Badge>;
  }
  
  return (
    <div className="grid grid-cols-12 items-center gap-4 py-4 border-b">
      <div className="col-span-3 md:col-span-4">
        <p className="font-medium">{payment.service}</p>
        <p className="text-sm text-muted-foreground">Ref: {payment.reference}</p>
      </div>
      <div className="col-span-2 md:col-span-2 font-medium text-right">
        {payment.amount.toLocaleString()} DZD
      </div>
      <div className="col-span-3 md:col-span-2 text-muted-foreground text-sm text-center">
        {payment.date}
      </div>
      <div className="col-span-2 md:col-span-2 text-center">
        {statusBadge}
      </div>
      <div className="col-span-2 md:col-span-2 text-right">
        <Button size="sm" variant="ghost">
          <Receipt className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const InvoiceRow = ({ invoice, onPay }: { invoice: any, onPay: (id: string) => void }) => {
  let statusBadge;
  
  switch (invoice.status) {
    case "paid":
      statusBadge = <Badge className="bg-green-500">Paid</Badge>;
      break;
    case "unpaid":
      statusBadge = <Badge variant="outline" className="text-yellow-500 border-yellow-500">Unpaid</Badge>;
      break;
    case "cancelled":
      statusBadge = <Badge variant="destructive">Cancelled</Badge>;
      break;
    default:
      statusBadge = <Badge variant="outline">Unknown</Badge>;
  }
  
  return (
    <div className="grid grid-cols-12 items-center gap-4 py-4 border-b">
      <div className="col-span-3 md:col-span-4">
        <p className="font-medium">{invoice.service}</p>
        <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
      </div>
      <div className="col-span-2 md:col-span-2 font-medium text-right">
        {invoice.amount.toLocaleString()} DZD
      </div>
      <div className="col-span-3 md:col-span-2 text-muted-foreground text-sm text-center">
        {invoice.date}
      </div>
      <div className="col-span-2 md:col-span-2 text-center">
        {statusBadge}
      </div>
      <div className="col-span-2 md:col-span-2 text-right">
        {invoice.status === "unpaid" ? (
          <Button size="sm" onClick={() => onPay(invoice.id)}>Pay</Button>
        ) : (
          <>
            <Button size="sm" variant="ghost">
              <FileText className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ method }: { method: any }) => {
  return (
    <Card className={`${method.default ? 'border-primary/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-primary" />
            <div>
              <p className="font-medium">{method.type}</p>
              {method.type === "Credit Card" ? (
                <p className="text-sm text-muted-foreground">
                  {method.brand} •••• {method.last4} | Expires {method.expiry}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {method.bank} •••• {method.last4}
                </p>
              )}
            </div>
          </div>
          {method.default && <Badge variant="outline">Default</Badge>}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between border-t">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
      </CardFooter>
    </Card>
  );
};

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("payments");

  const handlePayInvoice = (invoiceId: string) => {
    console.log(`Processing payment for invoice ${invoiceId}`);
    // Here would be the logic to handle payment
  };
  
  // Filter payments based on search query
  const filteredPayments = payments.filter(
    payment => payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
              payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    invoice => invoice.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
              invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payments & Invoices</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-60 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="payments" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="payments">Payments History</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payments" className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View all your past and pending payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-12 items-center gap-4 py-2 border-b font-medium">
                      <div className="col-span-3 md:col-span-4">Service</div>
                      <div className="col-span-2 md:col-span-2 text-right">Amount</div>
                      <div className="col-span-3 md:col-span-2 text-center">Date</div>
                      <div className="col-span-2 md:col-span-2 text-center">Status</div>
                      <div className="col-span-2 md:col-span-2 text-right">Actions</div>
                    </div>
                    
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map(payment => (
                        <PaymentRow key={payment.id} payment={payment} />
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No payments found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {searchQuery ? `No payments matching "${searchQuery}"` : "You haven't made any payments yet"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices" className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>View and pay your pending invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-12 items-center gap-4 py-2 border-b font-medium">
                      <div className="col-span-3 md:col-span-4">Service</div>
                      <div className="col-span-2 md:col-span-2 text-right">Amount</div>
                      <div className="col-span-3 md:col-span-2 text-center">Issue Date</div>
                      <div className="col-span-2 md:col-span-2 text-center">Status</div>
                      <div className="col-span-2 md:col-span-2 text-right">Actions</div>
                    </div>
                    
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map(invoice => (
                        <InvoiceRow key={invoice.id} invoice={invoice} onPay={handlePayInvoice} />
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {searchQuery ? `No invoices matching "${searchQuery}"` : "You don't have any invoices"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {selectedTab === "payments" && (
          <>
            <h2 className="text-xl font-semibold mt-4">Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPaymentMethods.map(method => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
              <Card className="border-dashed">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <CreditCard className="h-10 w-10 mb-4 text-muted-foreground" />
                  <h3 className="font-medium">Add New Payment Method</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Add a credit card or bank account for faster checkout
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Method
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
