
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Plus, Pencil, Trash } from "lucide-react";
import { getTableName } from "@/utils/tokenUtils";

interface Entity {
  [key: string]: any;
}

const DataManager: React.FC = () => {
  return (
    <Tabs defaultValue="destinations" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="destinations">Destinations</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="clients">Clients</TabsTrigger>
      </TabsList>
      <TabsContent value="destinations">
        <DestinationsManager />
      </TabsContent>
      <TabsContent value="programs">
        <ProgramsManager />
      </TabsContent>
      <TabsContent value="services">
        <ServicesManager />
      </TabsContent>
      <TabsContent value="clients">
        <ClientsManager />
      </TabsContent>
    </Tabs>
  );
};

// Destinations Manager
const DestinationsManager: React.FC = () => {
  const [destinations, setDestinations] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    country_name: "",
    description: "",
    visa_requirements: "",
    image_url: "",
    is_active: true
  });
  const { toast } = useToast();

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(getTableName('destinations'))
        .select("*")
        .order("country_name", { ascending: true });

      if (error) {
        throw error;
      }

      setDestinations(data || []);
    } catch (error: any) {
      console.error("Error fetching destinations:", error.message);
      toast({
        title: "Error fetching destinations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDestinations();
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Destinations data has been refreshed.",
    });
  };

  const handleAdd = () => {
    setFormData({
      country_name: "",
      description: "",
      visa_requirements: "",
      image_url: "",
      is_active: true
    });
    setShowAddDialog(true);
  };

  const handleEdit = (destination: Entity) => {
    setCurrentDestination(destination);
    setFormData({
      country_name: destination.country_name || "",
      description: destination.description || "",
      visa_requirements: destination.visa_requirements || "",
      image_url: destination.image_url || "",
      is_active: destination.is_active !== false
    });
    setShowEditDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleAddSubmit = async () => {
    try {
      if (!formData.country_name) {
        toast({
          title: "Validation Error",
          description: "Country name is required",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from(getTableName('destinations'))
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Destination added",
        description: `${formData.country_name} has been added successfully`,
      });
      
      setShowAddDialog(false);
      await fetchDestinations();
    } catch (error: any) {
      console.error("Error adding destination:", error.message);
      toast({
        title: "Error adding destination",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!currentDestination || !formData.country_name) {
        toast({
          title: "Validation Error",
          description: "Country name is required",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from(getTableName('destinations'))
        .update(formData)
        .eq("destination_id", currentDestination.destination_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Destination updated",
        description: `${formData.country_name} has been updated successfully`,
      });
      
      setShowEditDialog(false);
      await fetchDestinations();
    } catch (error: any) {
      console.error("Error updating destination:", error.message);
      toast({
        title: "Error updating destination",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (destination: Entity) => {
    if (!window.confirm(`Are you sure you want to delete ${destination.country_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from(getTableName('destinations'))
        .delete()
        .eq("destination_id", destination.destination_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Destination deleted",
        description: `${destination.country_name} has been deleted successfully`,
      });
      
      await fetchDestinations();
    } catch (error: any) {
      console.error("Error deleting destination:", error.message);
      toast({
        title: "Error deleting destination",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Destinations Management</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No destinations found. Add your first destination!</TableCell>
                </TableRow>
              ) : (
                destinations.map((destination) => (
                  <TableRow key={destination.destination_id}>
                    <TableCell className="font-medium">{destination.country_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{destination.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${destination.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {destination.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(destination)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(destination)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Destination Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="country_name">Country Name *</Label>
              <Input
                id="country_name"
                name="country_name"
                value={formData.country_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visa_requirements">Visa Requirements</Label>
              <Textarea
                id="visa_requirements"
                name="visa_requirements"
                value={formData.visa_requirements}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Add Destination</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_country_name">Country Name *</Label>
              <Input
                id="edit_country_name"
                name="country_name"
                value={formData.country_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_visa_requirements">Visa Requirements</Label>
              <Textarea
                id="edit_visa_requirements"
                name="visa_requirements"
                value={formData.visa_requirements}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_image_url">Image URL</Label>
              <Input
                id="edit_image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Update Destination</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Programs Manager
const ProgramsManager: React.FC = () => {
  const [programs, setPrograms] = useState<Entity[]>([]);
  const [destinations, setDestinations] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    program_name: "",
    description: "",
    destination_id: "",
    requirements: "",
    fee: "",
    duration: "",
    is_active: true
  });
  const { toast } = useToast();

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(getTableName('programs'))
        .select("*, destinations(country_name)")
        .order("program_name", { ascending: true });

      if (error) {
        throw error;
      }

      setPrograms(data || []);
    } catch (error: any) {
      console.error("Error fetching programs:", error.message);
      toast({
        title: "Error fetching programs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from(getTableName('destinations'))
        .select("destination_id, country_name")
        .eq("is_active", true)
        .order("country_name", { ascending: true });

      if (error) {
        throw error;
      }

      setDestinations(data || []);
    } catch (error: any) {
      console.error("Error fetching destinations:", error.message);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPrograms();
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Programs data has been refreshed.",
    });
  };

  const handleAdd = () => {
    setFormData({
      program_name: "",
      description: "",
      destination_id: "",
      requirements: "",
      fee: "",
      duration: "",
      is_active: true
    });
    setShowAddDialog(true);
  };

  const handleEdit = (program: Entity) => {
    setCurrentProgram(program);
    setFormData({
      program_name: program.program_name || "",
      description: program.description || "",
      destination_id: program.destination_id || "",
      requirements: program.requirements || "",
      fee: program.fee ? program.fee.toString() : "",
      duration: program.duration || "",
      is_active: program.is_active !== false
    });
    setShowEditDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleAddSubmit = async () => {
    try {
      if (!formData.program_name) {
        toast({
          title: "Validation Error",
          description: "Program name is required",
          variant: "destructive",
        });
        return;
      }

      const programData = {
        ...formData,
        fee: formData.fee ? parseFloat(formData.fee) : null
      };

      const { data, error } = await supabase
        .from(getTableName('programs'))
        .insert([programData])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Program added",
        description: `${formData.program_name} has been added successfully`,
      });
      
      setShowAddDialog(false);
      await fetchPrograms();
    } catch (error: any) {
      console.error("Error adding program:", error.message);
      toast({
        title: "Error adding program",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!currentProgram || !formData.program_name) {
        toast({
          title: "Validation Error",
          description: "Program name is required",
          variant: "destructive",
        });
        return;
      }

      const programData = {
        ...formData,
        fee: formData.fee ? parseFloat(formData.fee) : null
      };

      const { error } = await supabase
        .from(getTableName('programs'))
        .update(programData)
        .eq("program_id", currentProgram.program_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Program updated",
        description: `${formData.program_name} has been updated successfully`,
      });
      
      setShowEditDialog(false);
      await fetchPrograms();
    } catch (error: any) {
      console.error("Error updating program:", error.message);
      toast({
        title: "Error updating program",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (program: Entity) => {
    if (!window.confirm(`Are you sure you want to delete ${program.program_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from(getTableName('programs'))
        .delete()
        .eq("program_id", program.program_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Program deleted",
        description: `${program.program_name} has been deleted successfully`,
      });
      
      await fetchPrograms();
    } catch (error: any) {
      console.error("Error deleting program:", error.message);
      toast({
        title: "Error deleting program",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDestinations();
      await fetchPrograms();
    };
    
    loadData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Programs Management</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No programs found. Add your first program!</TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.program_id}>
                    <TableCell className="font-medium">{program.program_name}</TableCell>
                    <TableCell>{program.destinations?.country_name || "N/A"}</TableCell>
                    <TableCell>{program.duration || "N/A"}</TableCell>
                    <TableCell>{program.fee ? `$${program.fee}` : "N/A"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${program.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(program)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Program Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="program_name">Program Name *</Label>
              <Input
                id="program_name"
                name="program_name"
                value={formData.program_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination_id">Destination</Label>
              <select
                id="destination_id"
                name="destination_id"
                value={formData.destination_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a destination</option>
                {destinations.map((destination) => (
                  <option key={destination.destination_id} value={destination.destination_id}>
                    {destination.country_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fee">Fee ($)</Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 years"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Add Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_program_name">Program Name *</Label>
              <Input
                id="edit_program_name"
                name="program_name"
                value={formData.program_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_destination_id">Destination</Label>
              <select
                id="edit_destination_id"
                name="destination_id"
                value={formData.destination_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a destination</option>
                {destinations.map((destination) => (
                  <option key={destination.destination_id} value={destination.destination_id}>
                    {destination.country_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_requirements">Requirements</Label>
              <Textarea
                id="edit_requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_fee">Fee ($)</Label>
                <Input
                  id="edit_fee"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_duration">Duration</Label>
                <Input
                  id="edit_duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 years"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Update Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Services Manager
const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentService, setCurrentService] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    fee: "",
    estimated_duration: "",
    is_active: true
  });
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(getTableName('services'))
        .select("*")
        .order("service_name", { ascending: true });

      if (error) {
        throw error;
      }

      setServices(data || []);
    } catch (error: any) {
      console.error("Error fetching services:", error.message);
      toast({
        title: "Error fetching services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchServices();
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Services data has been refreshed.",
    });
  };

  const handleAdd = () => {
    setFormData({
      service_name: "",
      description: "",
      fee: "",
      estimated_duration: "",
      is_active: true
    });
    setShowAddDialog(true);
  };

  const handleEdit = (service: Entity) => {
    setCurrentService(service);
    setFormData({
      service_name: service.service_name || "",
      description: service.description || "",
      fee: service.fee ? service.fee.toString() : "",
      estimated_duration: service.estimated_duration || "",
      is_active: service.is_active !== false
    });
    setShowEditDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleAddSubmit = async () => {
    try {
      if (!formData.service_name) {
        toast({
          title: "Validation Error",
          description: "Service name is required",
          variant: "destructive",
        });
        return;
      }

      const serviceData = {
        ...formData,
        fee: formData.fee ? parseFloat(formData.fee) : null
      };

      const { data, error } = await supabase
        .from(getTableName('services'))
        .insert([serviceData])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Service added",
        description: `${formData.service_name} has been added successfully`,
      });
      
      setShowAddDialog(false);
      await fetchServices();
    } catch (error: any) {
      console.error("Error adding service:", error.message);
      toast({
        title: "Error adding service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!currentService || !formData.service_name) {
        toast({
          title: "Validation Error",
          description: "Service name is required",
          variant: "destructive",
        });
        return;
      }

      const serviceData = {
        ...formData,
        fee: formData.fee ? parseFloat(formData.fee) : null
      };

      const { error } = await supabase
        .from(getTableName('services'))
        .update(serviceData)
        .eq("service_id", currentService.service_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Service updated",
        description: `${formData.service_name} has been updated successfully`,
      });
      
      setShowEditDialog(false);
      await fetchServices();
    } catch (error: any) {
      console.error("Error updating service:", error.message);
      toast({
        title: "Error updating service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (service: Entity) => {
    if (!window.confirm(`Are you sure you want to delete ${service.service_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from(getTableName('services'))
        .delete()
        .eq("service_id", service.service_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Service deleted",
        description: `${service.service_name} has been deleted successfully`,
      });
      
      await fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error.message);
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No services found. Add your first service!</TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.service_id}>
                    <TableCell className="font-medium">{service.service_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>{service.fee ? `$${service.fee}` : "N/A"}</TableCell>
                    <TableCell>{service.estimated_duration || "N/A"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service_name">Service Name *</Label>
              <Input
                id="service_name"
                name="service_name"
                value={formData.service_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fee">Fee ($)</Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimated_duration">Duration</Label>
                <Input
                  id="estimated_duration"
                  name="estimated_duration"
                  value={formData.estimated_duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 months"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_service_name">Service Name *</Label>
              <Input
                id="edit_service_name"
                name="service_name"
                value={formData.service_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_fee">Fee ($)</Label>
                <Input
                  id="edit_fee"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_estimated_duration">Duration</Label>
                <Input
                  id="edit_estimated_duration"
                  name="estimated_duration"
                  value={formData.estimated_duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 months"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Update Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Clients Manager
const ClientsManager: React.FC = () => {
  const [clients, setClients] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(getTableName('client_users'))
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setClients(data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error.message);
      toast({
        title: "Error fetching clients",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClients();
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Client data has been refreshed.",
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clients Management</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Profile Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No clients found.</TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell className="font-medium">
                      {client.first_name && client.last_name
                        ? `${client.first_name} ${client.last_name}`
                        : client.username || "N/A"}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || "N/A"}</TableCell>
                    <TableCell>
                      {client.created_at
                        ? new Date(client.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.profile_status === "Complete"
                          ? "bg-green-100 text-green-800"
                          : client.profile_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {client.profile_status || "Incomplete"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DataManager;
