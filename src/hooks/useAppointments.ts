
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

      // First get appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", user.id);
      
      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        throw new Error(appointmentsError.message);
      }
      
      // Enrich appointments with slot and service data
      const enrichedAppointments = await Promise.all(
        (appointmentsData || []).map(async (appointment) => {
          let serviceName = "Consultation";
          let appointmentTime = "TBD"; 
          let appointmentDate = "TBD";
          let notes = "";
          let advisor = "Assigned Advisor";
          let mode = "In Person";
          let location = "Office";
          
          // Get slot details
          if (appointment.slot_id) {
            const { data: slotData, error: slotError } = await supabase
              .from("appointment_slots")
              .select(`
                *,
                admin_users (first_name, last_name, photo_url),
                services (name, duration)
              `)
              .eq("slot_id", appointment.slot_id)
              .maybeSingle();
              
            if (!slotError && slotData) {
              // If there's a service ID, try to get its name
              if (slotData.service_id && slotData.services) {
                serviceName = slotData.services.name;
              }
              
              // Get time details from slot
              if (slotData.date_time) {
                const dateObj = new Date(slotData.date_time);
                appointmentDate = dateObj.toLocaleDateString();
                appointmentTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
              
              notes = slotData.notes || "";
              
              // Add advisor info
              if (slotData.admin_users) {
                advisor = `${slotData.admin_users.first_name} ${slotData.admin_users.last_name}`;
              }
              
              // Add mode and location
              mode = slotData.mode || "In Person";
              location = slotData.location || "Office";
            }
          }
          
          return {
            id: appointment.appointment_id,
            service: serviceName,
            date: appointmentDate,
            status: appointment.status || "Scheduled",
            notes: notes || appointment.special_requests || "",
            time: appointmentTime,
            advisor,
            mode,
            location
          };
        })
      );
      
      return enrichedAppointments;
    },
  });
};
