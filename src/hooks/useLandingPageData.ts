
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLandingPageData = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refresh data function - can be called from components
  const refreshData = () => setRefreshKey(prevKey => prevKey + 1);
  
  // Fetch destinations
  const destinationsQuery = useQuery({
    queryKey: ["landingDestinations", refreshKey],
    queryFn: async () => {
      try {
        console.log("Fetching destinations data...");
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("is_active", true);
        
        if (error) {
          console.error("Error fetching destinations:", error);
          toast({
            title: "Error loading destinations",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!data || data.length === 0) {
          console.warn("No active destinations found in the database");
        } else {
          console.log(`Fetched ${data.length} destinations successfully`);
        }
        
        // Transform the data to match the expected format
        return data?.map(destination => ({
          id: destination.destination_id,
          name: destination.country_name,
          description: destination.description || "",
          image: destination.image_url || `/images/destination-${Math.floor(Math.random() * 6) + 1}.jpg`,
          requirements: destination.visa_requirements || "",
          flag: `https://flagcdn.com/w80/${destination.country_name.substring(0, 2).toLowerCase()}.png`,
          country: destination.country_name,
          city: destination.country_name.split(",")[0] || "Capital",
          programs: Math.floor(Math.random() * 10) + 5,
          partnered: Math.random() > 0.5,
          tuitionRange: "$" + (Math.floor(Math.random() * 15) + 5) + ",000 - $" + (Math.floor(Math.random() * 15) + 20) + ",000",
          languages: ["English", destination.country_name === "France" ? "French" : destination.country_name === "Germany" ? "German" : "English"],
          popular: Math.random() > 0.5,
          admissionRequirements: destination.visa_requirements || "Standard admission requirements apply. Contact us for details.",
          applicationDeadline: `${Math.floor(Math.random() * 28) + 1} ${["January", "February", "July", "September"][Math.floor(Math.random() * 4)]}`
        })) || [];
      } catch (error) {
        console.error("Unexpected error in destinations query:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch programs
  const programsQuery = useQuery({
    queryKey: ["landingPrograms", refreshKey],
    queryFn: async () => {
      try {
        console.log("Fetching programs data...");
        // First fetch programs
        const { data: programsData, error: programsError } = await supabase
          .from("programs")
          .select("*")
          .eq("is_active", true);
        
        if (programsError) {
          console.error("Error fetching programs:", programsError);
          toast({
            title: "Error loading programs",
            description: programsError.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!programsData || programsData.length === 0) {
          console.warn("No active programs found in the database");
        } else {
          console.log(`Fetched ${programsData.length} programs successfully`);
        }
        
        // Enrich programs with destination data
        const enrichedPrograms = await Promise.all(
          (programsData || []).map(async (program) => {
            let location = "International";
            
            if (program.destination_id) {
              // Fetch destination for this program
              const { data: destinationData, error: destinationError } = await supabase
                .from("destinations")
                .select("country_name")
                .eq("destination_id", program.destination_id)
                .maybeSingle();
              
              if (!destinationError && destinationData) {
                location = destinationData.country_name;
              }
            }
            
            return {
              id: program.program_id,
              name: program.program_name,
              description: program.description || "",
              location: location,
              duration: program.duration || "Varies",
              fee: program.fee ? `$${program.fee}` : "Contact for details",
              requirements: program.requirements || "",
            };
          })
        );
        
        return enrichedPrograms;
      } catch (error) {
        console.error("Error in programs query:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch services
  const servicesQuery = useQuery({
    queryKey: ["landingServices", refreshKey],
    queryFn: async () => {
      try {
        console.log("Fetching services data...");
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true);
        
        if (error) {
          console.error("Error fetching services:", error);
          toast({
            title: "Error loading services",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!data || data.length === 0) {
          console.warn("No active services found in the database");
        } else {
          console.log(`Fetched ${data.length} services successfully`);
        }
        
        return data?.map(service => ({
          id: service.service_id,
          name: service.service_name,
          description: service.description || "",
          duration: service.estimated_duration || "Varies",
          fee: service.fee ? `$${service.fee}` : "Contact for details",
        })) || [];
      } catch (error) {
        console.error("Unexpected error in services query:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch client testimonials
  const testimonialsQuery = useQuery({
    queryKey: ["testimonials", refreshKey],
    queryFn: async () => {
      try {
        console.log("Fetching testimonials data...");
        // In a real scenario, we would have a testimonials table
        // For now, let's use client_users with client_profiles to generate testimonials
        const { data, error } = await supabase
          .from("client_users")
          .select(`
            client_id, 
            first_name, 
            last_name,
            client_profiles(nationality)
          `)
          .limit(5);
        
        if (error) {
          console.error("Error fetching clients for testimonials:", error);
          toast({
            title: "Error loading testimonials",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!data || data.length === 0) {
          console.warn("No client users found in the database for testimonials");
        } else {
          console.log(`Fetched ${data.length} client users for testimonials`);
        }
        
        // Transform to testimonial format
        return data?.map(user => ({
          id: user.client_id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Client",
          role: user.client_profiles?.[0]?.nationality || "Client",
          content: "I had an amazing experience with their services. The consultants were very helpful and professional. I highly recommend their services to anyone looking to study or immigrate abroad.",
          avatar: `/images/avatar-${Math.floor(Math.random() * 6) + 1}.jpg`,
          rating: Math.floor(Math.random() * 2) + 4,
          location: user.client_profiles?.[0]?.nationality || "International"
        })) || [];
      } catch (error) {
        console.error("Unexpected error in testimonials query:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log data loading status for debugging
  useEffect(() => {
    console.log("Destinations:", destinationsQuery.data);
    console.log("Programs:", programsQuery.data);
    console.log("Services:", servicesQuery.data);
    console.log("Testimonials:", testimonialsQuery.data);
  }, [
    destinationsQuery.data, 
    programsQuery.data, 
    servicesQuery.data, 
    testimonialsQuery.data
  ]);

  return {
    destinations: {
      data: destinationsQuery.data || [],
      isLoading: destinationsQuery.isLoading,
      error: destinationsQuery.error,
      refetch: destinationsQuery.refetch
    },
    programs: {
      data: programsQuery.data || [],
      isLoading: programsQuery.isLoading,
      error: programsQuery.error,
      refetch: programsQuery.refetch
    },
    services: {
      data: servicesQuery.data || [],
      isLoading: servicesQuery.isLoading,
      error: servicesQuery.error,
      refetch: servicesQuery.refetch
    },
    testimonials: {
      data: testimonialsQuery.data || [],
      isLoading: testimonialsQuery.isLoading,
      error: testimonialsQuery.error,
      refetch: testimonialsQuery.refetch
    },
    refreshData
  };
};
