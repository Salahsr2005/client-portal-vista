
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export const useAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          appointment_id,
          status,
          special_requests,
          created_at,
          slot_id,
          slot:appointment_slots(
            date_time,
            end_time,
            duration,
            location,
            mode,
            admin:admin_id(first_name, last_name, photo_url),
            service:service_id(name, description, price)
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }

      if (!data) return [];

      return data.map((appointment) => {
        const slotData = appointment.slot || {};
        const adminData = slotData.admin || {};
        const serviceData = slotData.service || {};
        
        const dateTimeString = slotData.date_time || new Date().toISOString();
        const formattedDate = format(new Date(dateTimeString), "yyyy-MM-dd");
        const formattedTime = `${format(new Date(dateTimeString), "h:mm a")} - ${format(new Date(slotData.end_time || dateTimeString), "h:mm a")}`;
        
        return {
          id: appointment.appointment_id,
          status: appointment.status || "Reserved",
          date: formattedDate,
          time: formattedTime,
          notes: appointment.special_requests || "",
          service: serviceData.name || "Consultation",
          advisor: `${adminData.first_name || ''} ${adminData.last_name || ''}`.trim() || "Assigned Advisor",
          location: slotData.location || "Our Office",
          mode: slotData.mode || "In-Person"
        };
      });
    },
    enabled: !!user,
  });
};
