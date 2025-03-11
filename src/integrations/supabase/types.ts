export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          is_revoked: boolean | null
          token: string
          token_id: string
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          is_revoked?: boolean | null
          token: string
          token_id?: string
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          is_revoked?: boolean | null
          token?: string
          token_id?: string
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          app_id: string
          application_date: string | null
          client_id: string | null
          last_updated: string | null
          program_id: string | null
          status: string | null
        }
        Insert: {
          app_id?: string
          application_date?: string | null
          client_id?: string | null
          last_updated?: string | null
          program_id?: string | null
          status?: string | null
        }
        Update: {
          app_id?: string
          application_date?: string | null
          client_id?: string | null
          last_updated?: string | null
          program_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string | null
          appointment_id: string
          client_id: string | null
          created_at: string | null
          notes: string | null
          service_id: string | null
          status: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_id?: string
          client_id?: string | null
          created_at?: string | null
          notes?: string | null
          service_id?: string | null
          status?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_id?: string
          client_id?: string | null
          created_at?: string | null
          notes?: string | null
          service_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          document_id: string
          document_name: string
          document_type: string
          file_path: string
          notes: string | null
          status: string | null
          upload_date: string | null
        }
        Insert: {
          client_id?: string | null
          document_id?: string
          document_name: string
          document_type: string
          file_path: string
          notes?: string | null
          status?: string | null
          upload_date?: string | null
        }
        Update: {
          client_id?: string | null
          document_id?: string
          document_name?: string
          document_type?: string
          file_path?: string
          notes?: string | null
          status?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          client_id: string | null
          current_address: string | null
          education_background: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          language_proficiency: string | null
          nationality: string | null
          passport_expiry_date: string | null
          passport_number: string | null
          profile_id: string
          work_experience: string | null
        }
        Insert: {
          client_id?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          nationality?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          work_experience?: string | null
        }
        Update: {
          client_id?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          nationality?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          work_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_users: {
        Row: {
          client_id: string
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          last_login: string | null
          last_name: string | null
          password_hash: string
          phone: string | null
          profile_status: string | null
          registration_type: string | null
          username: string
        }
        Insert: {
          client_id?: string
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          last_login?: string | null
          last_name?: string | null
          password_hash: string
          phone?: string | null
          profile_status?: string | null
          registration_type?: string | null
          username: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          last_login?: string | null
          last_name?: string | null
          password_hash?: string
          phone?: string | null
          profile_status?: string | null
          registration_type?: string | null
          username?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          country_name: string
          description: string | null
          destination_id: string
          image_url: string | null
          is_active: boolean | null
          popular_programs: string | null
          visa_requirements: string | null
        }
        Insert: {
          country_name: string
          description?: string | null
          destination_id?: string
          image_url?: string | null
          is_active?: boolean | null
          popular_programs?: string | null
          visa_requirements?: string | null
        }
        Update: {
          country_name?: string
          description?: string | null
          destination_id?: string
          image_url?: string | null
          is_active?: boolean | null
          popular_programs?: string | null
          visa_requirements?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          is_read: boolean | null
          message_id: string
          recipient_id: string | null
          recipient_type: Database["public"]["Enums"]["user_type"] | null
          sender_id: string | null
          sender_type: Database["public"]["Enums"]["user_type"] | null
          sent_at: string | null
          subject: string | null
        }
        Insert: {
          content?: string | null
          is_read?: boolean | null
          message_id?: string
          recipient_id?: string | null
          recipient_type?: Database["public"]["Enums"]["user_type"] | null
          sender_id?: string | null
          sender_type?: Database["public"]["Enums"]["user_type"] | null
          sent_at?: string | null
          subject?: string | null
        }
        Update: {
          content?: string | null
          is_read?: boolean | null
          message_id?: string
          recipient_id?: string | null
          recipient_type?: Database["public"]["Enums"]["user_type"] | null
          sender_id?: string | null
          sender_type?: Database["public"]["Enums"]["user_type"] | null
          sent_at?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          client_id: string | null
          created_at: string | null
          is_read: boolean | null
          message: string | null
          notification_id: string
          notification_type: string | null
          title: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id?: string
          notification_type?: string | null
          title?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id?: string
          notification_type?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          pay_id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          pay_id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          pay_id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          description: string | null
          destination_id: string | null
          duration: string | null
          fee: number | null
          is_active: boolean | null
          program_id: string
          program_name: string
          requirements: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          duration?: string | null
          fee?: number | null
          is_active?: boolean | null
          program_id?: string
          program_name: string
          requirements?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          duration?: string | null
          fee?: number | null
          is_active?: boolean | null
          program_id?: string
          program_name?: string
          requirements?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string | null
          estimated_duration: string | null
          fee: number | null
          is_active: boolean | null
          service_id: string
          service_name: string
        }
        Insert: {
          description?: string | null
          estimated_duration?: string | null
          fee?: number | null
          is_active?: boolean | null
          service_id?: string
          service_name: string
        }
        Update: {
          description?: string | null
          estimated_duration?: string | null
          fee?: number | null
          is_active?: boolean | null
          service_id?: string
          service_name?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_description: string | null
          activity_type: string | null
          ip_address: string | null
          log_id: string
          timestamp: string | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          activity_description?: string | null
          activity_type?: string | null
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          activity_description?: string | null
          activity_type?: string | null
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "Admin" | "Client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
