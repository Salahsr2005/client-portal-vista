
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { initializeStorageBuckets } from "@/utils/databaseHelpers";

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userProfile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return null;
      }

      // Initialize storage buckets
      await initializeStorageBuckets();

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
        // If user data doesn't exist yet in client_users table, 
        // create a new entry based on auth user data
        const { data: newUserData, error: insertError } = await supabase
          .from("client_users")
          .insert({
            client_id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || 'user',
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || '',
            phone: user?.user_metadata?.phone || '',
            profile_status: 'Incomplete',
            password_hash: 'placeholder' // Required field in the schema
          })
          .select('*')
          .single();
          
        if (insertError) {
          console.error("Error creating user profile:", insertError);
          throw new Error(insertError.message);
        }
        
        // Return the newly created user data
        return {
          id: newUserData.client_id,
          username: newUserData.username,
          email: newUserData.email,
          firstName: newUserData.first_name || "",
          lastName: newUserData.last_name || "",
          phone: newUserData.phone || "",
          dateOfBirth: newUserData.date_of_birth || "",
          profileStatus: newUserData.profile_status || "Incomplete",
          createdAt: newUserData.created_at || "",
          lastLogin: newUserData.last_login || "",
          photoUrl: newUserData.photo_url || "",
          city: newUserData.city || "",
          country: newUserData.country || "",
          nationality: newUserData.nationality || "",
          
          // Profile data (empty since it's a new user)
          currentAddress: "",
          passportNumber: "",
          passportExpiryDate: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          workExperience: "",
          educationBackground: "",
          languageProficiency: "",
        };
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
        photoUrl: userData.photo_url || "",
        nationality: userData.nationality || "",
        city: userData.city || "",
        country: userData.country || "",
        
        // Profile data (if available)
        currentAddress: profileData?.current_address || "",
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
