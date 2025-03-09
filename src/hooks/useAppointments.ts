
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", user.id);
      
      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        throw new Error(appointmentsError.message);
      }
      
      // Enrich appointments with service data
      const enrichedAppointments = await Promise.all(
        (appointmentsData || []).map(async (appointment) => {
          let serviceName = "Consultation";
          
          if (appointment.service_id) {
            // Fetch service data
            const { data: serviceData, error: serviceError } = await supabase
              .from("services")
              .select("service_name")
              .eq("service_id", appointment.service_id)
              .maybeSingle();
            
            if (!serviceError && serviceData) {
              serviceName = serviceData.service_name;
            }
          }
          
          return {
            id: appointment.appointment_id,
            service: serviceName,
            date: appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : "TBD",
            status: appointment.status || "Scheduled",
            notes: appointment.notes || "",
            time: appointment.appointment_date 
              ? new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : "TBD",
          };
        })
      );
      
      return enrichedAppointments;
    },
  });
};
