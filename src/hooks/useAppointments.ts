
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface SlotAdmin {
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}

interface SlotService {
  name?: string;
  description?: string;
  price?: number;
}

interface AppointmentSlot {
  date_time?: string;
  end_time?: string;
  duration?: number;
  location?: string;
  mode?: string;
  admin?: SlotAdmin;
  service?: SlotService;
}

interface AppointmentData {
  appointment_id: string;
  status: string;
  special_requests?: string;
  created_at: string;
  slot_id: string;
  slot?: AppointmentSlot;
}

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

      if (!data || data.length === 0) return [];

      return data.map((appointment: AppointmentData) => {
        // Initialize with empty objects for safe access
        const slotData: AppointmentSlot = appointment.slot || {};
        const adminData: SlotAdmin = slotData.admin || {};
        const serviceData: SlotService = slotData.service || {};
        
        const dateTimeString = slotData.date_time || new Date().toISOString();
        const formattedDate = format(new Date(dateTimeString), "yyyy-MM-dd");
        
        let formattedTime = "";
        if (slotData.date_time) {
          const startTime = format(new Date(dateTimeString), "h:mm a");
          let endTime = "";
          
          if (slotData.end_time) {
            endTime = format(new Date(slotData.end_time), "h:mm a");
          } else {
            // Default to 1 hour later if no end time
            endTime = format(new Date(new Date(dateTimeString).getTime() + 60*60*1000), "h:mm a");
          }
          
          formattedTime = `${startTime} - ${endTime}`;
        } else {
          formattedTime = "Time not specified";
        }
        
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
