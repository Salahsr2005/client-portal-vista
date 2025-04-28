
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

// Define the store's state types
type State = {
  events: Event[];
  loading: boolean;
  error: Error | null;
};

// Define the event interface
interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  textColor: string;
  display: string;
  allDay: boolean;
  extendedProps: {
    status: string;
    note?: string;
    breakTime?: string;
    isFavorite?: boolean;
    task?: any;
  };
}

// Define the store actions
type Actions = {
  fetchEvents: (month: string) => Promise<Event[]>;
  addEvent: (event: any) => Promise<any>;
  updateEvent: (event: any) => Promise<any>;
  removeEvent: (eventId: string) => Promise<any>;
  toggleFavorite: (taskId: string) => Promise<any>;
  updateTaskStatus: (taskId: string, status: string) => Promise<any>;
  getContrastingTextColor: (hex: string) => string;
};

// Create the store using Zustand
export const useCalendarStore = create<State & Actions>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (month: string) => {
    set({ loading: true, error: null });
    
    try {
      console.log("Store fetching events for month:", month);
      
      // Parse the month format (e.g. "2025-04")
      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-31`; // This works for all months since any invalid dates will be automatically adjusted
      
      // Fetch appointments for the specified month
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          appointment_id,
          slot_id,
          client_id,
          status,
          reason,
          special_requests,
          created_at,
          appointment_slots (
            date_time,
            end_time,
            location,
            mode,
            admin_users (
              first_name,
              last_name,
              photo_url
            ),
            services (
              name,
              category
            )
          )
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate);
      
      if (error) throw error;
      
      // Map the appointments to events
      const mappedEvents = (appointments || []).map((appointment) => {
        const startDateTime = appointment.appointment_slots?.date_time || new Date().toISOString();
        const endDateTime = appointment.appointment_slots?.end_time || new Date().toISOString();
        const serviceName = appointment.appointment_slots?.services?.name || 'Appointment';
        const adminName = appointment.appointment_slots?.admin_users ? 
          `${appointment.appointment_slots.admin_users.first_name} ${appointment.appointment_slots.admin_users.last_name}` : 
          'Staff';
          
        // Generate color based on status
        let backgroundColor = '#4f46e5'; // default indigo color
        
        switch (appointment.status) {
          case 'Completed':
            backgroundColor = '#16a34a'; // green
            break;
          case 'Cancelled':
            backgroundColor = '#dc2626'; // red
            break;
          case 'No-Show':
            backgroundColor = '#7c3aed'; // purple
            break;
          default:
            break;
        }
        
        return {
          id: appointment.appointment_id,
          title: `${serviceName} with ${adminName}`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor,
          textColor: '#ffffff',
          display: 'block',
          allDay: false,
          extendedProps: {
            status: appointment.status,
            note: appointment.special_requests,
            location: appointment.appointment_slots?.location,
            mode: appointment.appointment_slots?.mode,
            task: appointment // Store the full appointment in task property for reference
          }
        };
      });
      
      console.log(`Store mapped ${mappedEvents.length} events from API response`);
      
      // Update the state with the fetched events
      set({ events: mappedEvents, loading: false });
      
      return mappedEvents;
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      set({ error: error as Error, loading: false });
      return [];
    }
  },

  addEvent: async (event) => {
    try {
      // Create a new appointment slot
      const { data: slotData, error: slotError } = await supabase
        .from('appointment_slots')
        .insert({
          admin_id: event.adminId,
          date_time: event.start,
          end_time: event.end,
          location: event.location || 'Office',
          mode: event.mode || 'In-Person',
          service_id: event.serviceId,
          status: 'Available',
          max_bookings: event.maxBookings || 1
        })
        .select()
        .single();
        
      if (slotError) throw slotError;
      
      return slotData;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  },

  updateEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from('appointment_slots')
        .update({
          date_time: event.start,
          end_time: event.end,
          location: event.location,
          mode: event.mode,
          service_id: event.serviceId,
          status: event.status
        })
        .eq('slot_id', event.id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  removeEvent: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .delete()
        .eq('appointment_id', eventId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error removing event:", error);
      throw error;
    }
  },

  toggleFavorite: async (taskId) => {
    try {
      // Toggle the is_favorite flag for an appointment
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_id, is_favorite')
        .eq('appointment_id', taskId)
        .single();
      
      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ is_favorite: !data.is_favorite })
        .eq('appointment_id', taskId);
      
      if (updateError) throw updateError;
      
      return { ...data, is_favorite: !data.is_favorite };
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('appointment_id', taskId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  },

  getContrastingTextColor: (hex) => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    // Calculate the luminance
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds and white for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }
}));
