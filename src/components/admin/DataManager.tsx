
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Trash2, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DataManager() {
  const [activeTab, setActiveTab] = useState("destinations");
  const { toast } = useToast();
  
  // Form submission handler
  const handleSubmit = async (formData: any, table: string) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: `The ${table.slice(0, -1)} has been added successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error(`Error adding ${table}:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to add the ${table.slice(0, -1)}.`,
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Add, edit, or delete data in the Euro Visa database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="destinations" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="destinations">
            <DestinationsManager onSubmit={(data) => handleSubmit(data, "destinations")} />
          </TabsContent>
          
          <TabsContent value="programs">
            <ProgramsManager onSubmit={(data) => handleSubmit(data, "programs")} />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesManager onSubmit={(data) => handleSubmit(data, "services")} />
          </TabsContent>
          
          <TabsContent value="clients">
            <ClientsManager onSubmit={(data) => handleSubmit(data, "client_users")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Destinations Manager Component
function DestinationsManager({ onSubmit }: { onSubmit: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    country_name: "",
    description: "",
    visa_requirements: "",
    popular_programs: "",
    image_url: "",
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        country_name: "",
        description: "",
        visa_requirements: "",
        popular_programs: "",
        image_url: "",
        is_active: true
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Add New Destination</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country_name">Country Name *</Label>
            <Input
              id="country_name"
              name="country_name"
              value={formData.country_name}
              onChange={handleChange}
              required
              placeholder="e.g., United Kingdom"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a detailed description of the destination..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="visa_requirements">Visa Requirements</Label>
          <Textarea
            id="visa_requirements"
            name="visa_requirements"
            value={formData.visa_requirements}
            onChange={handleChange}
            placeholder="List the visa requirements for this destination..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="popular_programs">Popular Programs</Label>
          <Textarea
            id="popular_programs"
            name="popular_programs"
            value={formData.popular_programs}
            onChange={handleChange}
            placeholder="List popular programs at this destination..."
            rows={2}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => 
              handleCheckboxChange("is_active", checked as boolean)
            }
          />
          <Label htmlFor="is_active">Active (will appear on the website)</Label>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Destination"}
        </Button>
      </form>
      
      <Separator className="my-6" />
      
      <DestinationsList />
    </div>
  );
}

// Programs Manager Component
function ProgramsManager({ onSubmit }: { onSubmit: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    program_name: "",
    description: "",
    destination_id: "",
    requirements: "",
    fee: "",
    duration: "",
    is_active: true
  });
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const { toast } = useToast();
  
  // Fetch destinations for the dropdown
  React.useEffect(() => {
    async function fetchDestinations() {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("destination_id, country_name")
          .eq("is_active", true);
        
        if (error) throw error;
        
        setDestinations(data || []);
      } catch (error: any) {
        console.error("Error fetching destinations:", error);
        toast({
          title: "Error",
          description: "Failed to load destinations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingDestinations(false);
      }
    }
    
    fetchDestinations();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert fee to number if present
    const processedData = {
      ...formData,
      fee: formData.fee ? parseFloat(formData.fee) : null
    };
    
    try {
      await onSubmit(processedData);
      // Reset form after successful submission
      setFormData({
        program_name: "",
        description: "",
        destination_id: "",
        requirements: "",
        fee: "",
        duration: "",
        is_active: true
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Add New Program</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="program_name">Program Name *</Label>
            <Input
              id="program_name"
              name="program_name"
              value={formData.program_name}
              onChange={handleChange}
              required
              placeholder="e.g., Masters in Data Science"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination_id">Destination</Label>
            <select
              id="destination_id"
              name="destination_id"
              value={formData.destination_id}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              disabled={loadingDestinations}
            >
              <option value="">Select a destination</option>
              {destinations.map(dest => (
                <option key={dest.destination_id} value={dest.destination_id}>
                  {dest.country_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a detailed description of the program..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 years"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">Fee ($)</Label>
            <Input
              id="fee"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 10000"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List the requirements for this program..."
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => 
              handleCheckboxChange("is_active", checked as boolean)
            }
          />
          <Label htmlFor="is_active">Active (will appear on the website)</Label>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Program"}
        </Button>
      </form>
      
      <Separator className="my-6" />
      
      <ProgramsList />
    </div>
  );
}

// Services Manager Component
function ServicesManager({ onSubmit }: { onSubmit: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    fee: "",
    estimated_duration: "",
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert fee to number if present
    const processedData = {
      ...formData,
      fee: formData.fee ? parseFloat(formData.fee) : null
    };
    
    try {
      await onSubmit(processedData);
      // Reset form after successful submission
      setFormData({
        service_name: "",
        description: "",
        fee: "",
        estimated_duration: "",
        is_active: true
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Add New Service</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service_name">Service Name *</Label>
          <Input
            id="service_name"
            name="service_name"
            value={formData.service_name}
            onChange={handleChange}
            required
            placeholder="e.g., Visa Application Assistance"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a detailed description of the service..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated_duration">Estimated Duration</Label>
            <Input
              id="estimated_duration"
              name="estimated_duration"
              value={formData.estimated_duration}
              onChange={handleChange}
              placeholder="e.g., 2-3 weeks"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">Fee ($)</Label>
            <Input
              id="fee"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => 
              handleCheckboxChange("is_active", checked as boolean)
            }
          />
          <Label htmlFor="is_active">Active (will appear on the website)</Label>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Service"}
        </Button>
      </form>
      
      <Separator className="my-6" />
      
      <ServicesList />
    </div>
  );
}

// Clients Manager Component
function ClientsManager({ onSubmit }: { onSubmit: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    registration_type: "Website",
    profile_status: "Active"
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you'd never store passwords directly
      // Instead, you'd use Supabase Auth or a secure authentication method
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        username: "",
        email: "",
        password_hash: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
        registration_type: "Website",
        profile_status: "Active"
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Add New Client</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="e.g., johndoe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g., john@example.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password_hash">Password *</Label>
          <Input
            id="password_hash"
            name="password_hash"
            type="password"
            value={formData.password_hash}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
          <p className="text-sm text-muted-foreground">
            Note: In a production environment, you should use Supabase Auth for secure user management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="e.g., John"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="e.g., Doe"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +1234567890"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registration_type">Registration Type</Label>
            <select
              id="registration_type"
              name="registration_type"
              value={formData.registration_type}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="Website">Website</option>
              <option value="Mobile">Mobile App</option>
              <option value="Admin">Added by Admin</option>
              <option value="Partner">Partner Referral</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile_status">Profile Status</Label>
            <select
              id="profile_status"
              name="profile_status"
              value={formData.profile_status}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Incomplete">Incomplete</option>
              <option value="Pending">Pending Verification</option>
            </select>
          </div>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Client"}
        </Button>
      </form>
      
      <Separator className="my-6" />
      
      <ClientsList />
    </div>
  );
}

// List components
function DestinationsList() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("country_name", { ascending: true });
      
      if (error) throw error;
      
      setDestinations(data || []);
    } catch (error: any) {
      console.error("Error fetching destinations:", error);
      toast({
        title: "Error",
        description: "Failed to load destinations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("destinations")
        .update({ is_active: !currentStatus })
        .eq("destination_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Destination ${currentStatus ? "deactivated" : "activated"} successfully.`,
      });
      
      // Refresh the list
      fetchDestinations();
    } catch (error: any) {
      console.error("Error toggling destination status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update destination status.",
        variant: "destructive",
      });
    }
  };

  const deleteDestination = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("destinations")
        .delete()
        .eq("destination_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Destination deleted successfully.",
      });
      
      // Refresh the list
      fetchDestinations();
    } catch (error: any) {
      console.error("Error deleting destination:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete destination.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Existing Destinations</h3>
      
      {loading ? (
        <p className="text-center py-4">Loading destinations...</p>
      ) : destinations.length === 0 ? (
        <p className="text-center py-4">No destinations found.</p>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {destinations.map(destination => (
              <div key={destination.destination_id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{destination.country_name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {destination.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleActive(
                        destination.destination_id, 
                        destination.is_active
                      )}
                    >
                      {destination.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteDestination(destination.destination_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    destination.is_active ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-xs">
                    {destination.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function ProgramsList() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("programs")
        .select(`
          *,
          destinations(country_name)
        `)
        .order("program_name", { ascending: true });
      
      if (error) throw error;
      
      setPrograms(data || []);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      toast({
        title: "Error",
        description: "Failed to load programs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("programs")
        .update({ is_active: !currentStatus })
        .eq("program_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Program ${currentStatus ? "deactivated" : "activated"} successfully.`,
      });
      
      // Refresh the list
      fetchPrograms();
    } catch (error: any) {
      console.error("Error toggling program status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update program status.",
        variant: "destructive",
      });
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("program_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Program deleted successfully.",
      });
      
      // Refresh the list
      fetchPrograms();
    } catch (error: any) {
      console.error("Error deleting program:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete program.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Existing Programs</h3>
      
      {loading ? (
        <p className="text-center py-4">Loading programs...</p>
      ) : programs.length === 0 ? (
        <p className="text-center py-4">No programs found.</p>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {programs.map(program => (
              <div key={program.program_id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{program.program_name}</h4>
                    <p className="text-sm mt-1">
                      {program.destinations?.country_name ? (
                        <span className="text-muted-foreground">
                          {program.destinations.country_name} • {program.duration || 'Duration not specified'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          No destination specified • {program.duration || 'Duration not specified'}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {program.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleActive(
                        program.program_id, 
                        program.is_active
                      )}
                    >
                      {program.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteProgram(program.program_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    program.is_active ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-xs">
                    {program.is_active ? "Active" : "Inactive"}
                  </span>
                  {program.fee && (
                    <span className="text-xs ml-4">Fee: ${program.fee}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function ServicesList() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("service_name", { ascending: true });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !currentStatus })
        .eq("service_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Service ${currentStatus ? "deactivated" : "activated"} successfully.`,
      });
      
      // Refresh the list
      fetchServices();
    } catch (error: any) {
      console.error("Error toggling service status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service status.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("service_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
      
      // Refresh the list
      fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete service.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Existing Services</h3>
      
      {loading ? (
        <p className="text-center py-4">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center py-4">No services found.</p>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.service_id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{service.service_name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {service.description || "No description available."}
                    </p>
                    {service.estimated_duration && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated duration: {service.estimated_duration}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleActive(
                        service.service_id, 
                        service.is_active
                      )}
                    >
                      {service.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteService(service.service_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    service.is_active ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-xs">
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                  {service.fee && (
                    <span className="text-xs ml-4">Fee: ${service.fee}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_users")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setClients(data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("client_users")
        .update({ profile_status: status })
        .eq("client_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Client status updated to ${status} successfully.`,
      });
      
      // Refresh the list
      fetchClients();
    } catch (error: any) {
      console.error("Error updating client status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client status.",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("client_users")
        .delete()
        .eq("client_id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Client deleted successfully.",
      });
      
      // Refresh the list
      fetchClients();
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete client.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Existing Clients</h3>
      
      {loading ? (
        <p className="text-center py-4">Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-center py-4">No clients found.</p>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {clients.map(client => (
              <div key={client.client_id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {client.first_name && client.last_name 
                        ? `${client.first_name} ${client.last_name}`
                        : client.username}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.email}
                    </p>
                    {client.phone && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {client.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={client.profile_status}
                      onChange={(e) => updateStatus(client.client_id, e.target.value)}
                      className="h-8 px-2 text-xs rounded-md border border-input bg-background"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Incomplete">Incomplete</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteClient(client.client_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    client.profile_status === 'Active' ? "bg-green-500" : 
                    client.profile_status === 'Inactive' ? "bg-red-500" :
                    client.profile_status === 'Pending' ? "bg-yellow-500" : "bg-gray-500"
                  }`}></div>
                  <span className="text-xs">{client.profile_status}</span>
                  <span className="text-xs ml-4">
                    Joined: {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
