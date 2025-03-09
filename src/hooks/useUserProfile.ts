
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userProfile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return null;
      }

      // First, fetch the client user data
      const { data: userData, error: userError } = await supabase
        .from("client_users")
        .select("*")
        .eq("client_id", user.id)
        .maybeSingle();
      
      if (userError) {
        console.error("Error fetching user data:", userError);
        throw new Error(userError.message);
      }
      
      if (!userData) {
        return null;
      }
      
      // Then, fetch the client profile data if it exists
      const { data: profileData, error: profileError } = await supabase
        .from("client_profiles")
        .select("*")
        .eq("client_id", user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
      }
      
      // Return combined data
      return {
        id: userData.client_id,
        username: userData.username,
        email: userData.email,
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        phone: userData.phone || "",
        dateOfBirth: userData.date_of_birth || "",
        profileStatus: userData.profile_status || "Incomplete",
        createdAt: userData.created_at || "",
        lastLogin: userData.last_login || "",
        
        // Profile data (if available)
        currentAddress: profileData?.current_address || "",
        nationality: profileData?.nationality || "",
        passportNumber: profileData?.passport_number || "",
        passportExpiryDate: profileData?.passport_expiry_date || "",
        emergencyContactName: profileData?.emergency_contact_name || "",
        emergencyContactPhone: profileData?.emergency_contact_phone || "",
        workExperience: profileData?.work_experience || "",
        educationBackground: profileData?.education_background || "",
        languageProficiency: profileData?.language_proficiency || "",
      };
    },
  });
};
