
import React, { useState } from "react";
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
  XCircle
} from "lucide-react";

// Mock data for payments
const payments = [
  {
    id: "PMT-001",
    date: "2023-10-10",
    amount: 299.00,
    description: "Visa Application Assistance",
    status: "completed",
    method: "Credit Card",
    cardLast4: "4242"
  },
  {
    id: "PMT-002",
    date: "2023-10-05",
    amount: 149.00,
    description: "Pre-Departure Orientation",
    status: "completed",
    method: "PayPal",
    cardLast4: null
  },
  {
    id: "PMT-003",
    date: "2023-09-28",
    amount: 349.00,
    description: "Accommodation Placement Fee",
    status: "completed",
    method: "Credit Card",
    cardLast4: "1234"
  },
  {
    id: "PMT-004",
    date: "2023-10-15",
    amount: 499.00,
    description: "Language Proficiency Test Prep",
    status: "pending",
    method: "Bank Transfer",
    cardLast4: null
  },
  {
    id: "PMT-005",
    date: "2023-09-20",
    amount: 89.00,
    description: "Airport Pickup & Transfer",
    status: "failed",
    method: "Credit Card",
    cardLast4: "5678"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
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
  switch (status) {
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

// Calculate total amounts
const totalPaid = payments
  .filter(p => p.status === "completed")
  .reduce((sum, payment) => sum + payment.amount, 0);

const pendingAmount = payments
  .filter(p => p.status === "pending")
  .reduce((sum, payment) => sum + payment.amount, 0);

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter payments based on search term and filter
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && payment.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {payments.filter(p => p.status === "completed").length} transactions
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
              {payments.filter(p => p.status === "pending").length} pending transactions
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
              Credit Card, PayPal, Bank Transfer
            </p>
          </CardContent>
        </Card>
      </div>
      
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
                    <DropdownMenuItem>PayPal</DropdownMenuItem>
                    <DropdownMenuItem>Bank Transfer</DropdownMenuItem>
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
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {payment.method}
                            {payment.cardLast4 && <span className="text-xs text-muted-foreground ml-1">
                              (•••• {payment.cardLast4})
                            </span>}
                          </TableCell>
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
                                {payment.status === "completed" && (
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                  </DropdownMenuItem>
                                )}
                                {payment.status === "failed" && (
                                  <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                                )}
                                {payment.status === "pending" && (
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
            
            <TabsContent value="completed" className="m-0">
              {/* Same table structure as 'all' tab */}
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              {/* Same table structure as 'all' tab */}
            </TabsContent>
            
            <TabsContent value="failed" className="m-0">
              {/* Same table structure as 'all' tab */}
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
    </div>
  );
}
