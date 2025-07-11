export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          is_revoked: boolean | null
          token: string
          token_id: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          is_revoked?: boolean | null
          token: string
          token_id?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          is_revoked?: boolean | null
          token?: string
          token_id?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_id: string
          created_at: string | null
          email: string
          first_name: string
          last_active: string | null
          last_name: string
          password_hash: string
          phone: string | null
          photo_url: string | null
          role_id: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          admin_id?: string
          created_at?: string | null
          email: string
          first_name: string
          last_active?: string | null
          last_name: string
          password_hash: string
          phone?: string | null
          photo_url?: string | null
          role_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          email?: string
          first_name?: string
          last_active?: string | null
          last_name?: string
          password_hash?: string
          phone?: string | null
          photo_url?: string | null
          role_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          document_id: string
          file_path: string | null
          name: string
          status: string
          uploaded_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          document_id?: string
          file_path?: string | null
          name: string
          status?: string
          uploaded_at: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          document_id?: string
          file_path?: string | null
          name?: string
          status?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      application_timeline: {
        Row: {
          admin_id: string | null
          application_id: string
          date: string
          event_id: string
          note: string | null
          status: string
        }
        Insert: {
          admin_id?: string | null
          application_id: string
          date: string
          event_id?: string
          note?: string | null
          status: string
        }
        Update: {
          admin_id?: string | null
          application_id?: string
          date?: string
          event_id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_timeline_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "application_timeline_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      applications: {
        Row: {
          application_id: string
          assigned_to: string | null
          client_id: string
          created_at: string | null
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          priority: Database["public"]["Enums"]["priority_level"]
          program_id: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string
          assigned_to?: string | null
          client_id: string
          created_at?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          program_id: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          assigned_to?: string | null
          client_id?: string
          created_at?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          program_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_slots: {
        Row: {
          admin_id: string
          created_at: string | null
          current_bookings: number
          date_time: string
          duration: number
          end_time: string
          location: string
          max_bookings: number
          min_client_tier: Database["public"]["Enums"]["client_tier"]
          mode: Database["public"]["Enums"]["appointment_mode"]
          notes: string | null
          service_id: string | null
          slot_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          current_bookings?: number
          date_time: string
          duration: number
          end_time: string
          location: string
          max_bookings?: number
          min_client_tier?: Database["public"]["Enums"]["client_tier"]
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          service_id?: string | null
          slot_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          current_bookings?: number
          date_time?: string
          duration?: number
          end_time?: string
          location?: string
          max_bookings?: number
          min_client_tier?: Database["public"]["Enums"]["client_tier"]
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          service_id?: string | null
          slot_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_slots_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "appointment_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      appointments: {
        Row: {
          application_id: string | null
          appointment_id: string
          client_id: string
          created_at: string | null
          feedback: string | null
          rating: number | null
          reason: string
          slot_id: string
          special_requests: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          appointment_id?: string
          client_id: string
          created_at?: string | null
          feedback?: string | null
          rating?: number | null
          reason: string
          slot_id: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          appointment_id?: string
          client_id?: string
          created_at?: string | null
          feedback?: string | null
          rating?: number | null
          reason?: string
          slot_id?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "appointment_slots"
            referencedColumns: ["slot_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          edited_at: string | null
          is_edited: boolean | null
          message_id: string
          message_text: string
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          reply_to_message_id: string | null
          sender_id: string
          sender_type: Database["public"]["Enums"]["chat_participant_type"]
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
        }
        Insert: {
          chat_id: string
          edited_at?: string | null
          is_edited?: boolean | null
          message_id?: string
          message_text: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          reply_to_message_id?: string | null
          sender_id: string
          sender_type: Database["public"]["Enums"]["chat_participant_type"]
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Update: {
          chat_id?: string
          edited_at?: string | null
          is_edited?: boolean | null
          message_id?: string
          message_text?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          reply_to_message_id?: string | null
          sender_id?: string
          sender_type?: Database["public"]["Enums"]["chat_participant_type"]
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          display_name: string | null
          is_admin: boolean | null
          is_muted: boolean | null
          joined_at: string | null
          last_read_at: string | null
          notification_settings: Json | null
          participant_id: string
          participant_type: Database["public"]["Enums"]["chat_participant_type"]
          unread_count: number | null
        }
        Insert: {
          chat_id: string
          display_name?: string | null
          is_admin?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          notification_settings?: Json | null
          participant_id: string
          participant_type: Database["public"]["Enums"]["chat_participant_type"]
          unread_count?: number | null
        }
        Update: {
          chat_id?: string
          display_name?: string | null
          is_admin?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          notification_settings?: Json | null
          participant_id?: string
          participant_type?: Database["public"]["Enums"]["chat_participant_type"]
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      chats: {
        Row: {
          chat_id: string
          created_at: string | null
          is_active: boolean | null
          is_group_chat: boolean | null
          last_message_text: string | null
          last_message_time: string | null
          metadata: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          chat_id?: string
          created_at?: string | null
          is_active?: boolean | null
          is_group_chat?: boolean | null
          last_message_text?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          is_active?: boolean | null
          is_group_chat?: boolean | null
          last_message_text?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_id: string
          document_name: string
          document_type: string
          file_path: string
          notes: string | null
          status: string | null
          updated_at: string | null
          upload_date: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_id?: string
          document_name: string
          document_type: string
          file_path: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_id?: string
          document_name?: string
          document_type?: string
          file_path?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
          additional_notes: string | null
          client_id: string | null
          created_at: string | null
          current_address: string | null
          education_background: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          language_proficiency: string | null
          passport_expiry_date: string | null
          passport_number: string | null
          profile_id: string
          updated_at: string | null
          work_experience: string | null
        }
        Insert: {
          additional_notes?: string | null
          client_id?: string | null
          created_at?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          updated_at?: string | null
          work_experience?: string | null
        }
        Update: {
          additional_notes?: string | null
          client_id?: string | null
          created_at?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          updated_at?: string | null
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
          city: string | null
          client_id: string
          client_tier: Database["public"]["Enums"]["client_tier"] | null
          contact_preference:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          identity_card_number: string | null
          last_login: string | null
          last_name: string | null
          nationality: string | null
          password_hash: string
          phone: string | null
          photo_url: string | null
          profile_status: string | null
          registration_type: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          city?: string | null
          client_id?: string
          client_tier?: Database["public"]["Enums"]["client_tier"] | null
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          identity_card_number?: string | null
          last_login?: string | null
          last_name?: string | null
          nationality?: string | null
          password_hash: string
          phone?: string | null
          photo_url?: string | null
          profile_status?: string | null
          registration_type?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          city?: string | null
          client_id?: string
          client_tier?: Database["public"]["Enums"]["client_tier"] | null
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          identity_card_number?: string | null
          last_login?: string | null
          last_name?: string | null
          nationality?: string | null
          password_hash?: string
          phone?: string | null
          photo_url?: string | null
          profile_status?: string | null
          registration_type?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      consultation_results: {
        Row: {
          accommodation_preference: string | null
          budget: number
          consultation_date: string | null
          conversion_status: string | null
          created_at: string | null
          destination_preference: string | null
          duration_preference: string | null
          field_keywords: string[] | null
          field_preference: string | null
          halal_food_required: boolean | null
          housing_preference: string | null
          id: string
          language_preference: string | null
          language_test_required: boolean | null
          language_test_score: string | null
          living_costs_preference: number | null
          match_percentage: number | null
          matched_programs: Json | null
          notes: string | null
          preferences_data: Json | null
          recommended_programs: Json | null
          religious_facilities_required: boolean | null
          scholarship_required: boolean | null
          start_date_preference: string | null
          step_completed: number | null
          study_level: Database["public"]["Enums"]["study_level"] | null
          updated_at: string | null
          user_id: string | null
          work_while_studying: boolean | null
        }
        Insert: {
          accommodation_preference?: string | null
          budget: number
          consultation_date?: string | null
          conversion_status?: string | null
          created_at?: string | null
          destination_preference?: string | null
          duration_preference?: string | null
          field_keywords?: string[] | null
          field_preference?: string | null
          halal_food_required?: boolean | null
          housing_preference?: string | null
          id?: string
          language_preference?: string | null
          language_test_required?: boolean | null
          language_test_score?: string | null
          living_costs_preference?: number | null
          match_percentage?: number | null
          matched_programs?: Json | null
          notes?: string | null
          preferences_data?: Json | null
          recommended_programs?: Json | null
          religious_facilities_required?: boolean | null
          scholarship_required?: boolean | null
          start_date_preference?: string | null
          step_completed?: number | null
          study_level?: Database["public"]["Enums"]["study_level"] | null
          updated_at?: string | null
          user_id?: string | null
          work_while_studying?: boolean | null
        }
        Update: {
          accommodation_preference?: string | null
          budget?: number
          consultation_date?: string | null
          conversion_status?: string | null
          created_at?: string | null
          destination_preference?: string | null
          duration_preference?: string | null
          field_keywords?: string[] | null
          field_preference?: string | null
          halal_food_required?: boolean | null
          housing_preference?: string | null
          id?: string
          language_preference?: string | null
          language_test_required?: boolean | null
          language_test_score?: string | null
          living_costs_preference?: number | null
          match_percentage?: number | null
          matched_programs?: Json | null
          notes?: string | null
          preferences_data?: Json | null
          recommended_programs?: Json | null
          religious_facilities_required?: boolean | null
          scholarship_required?: boolean | null
          start_date_preference?: string | null
          step_completed?: number | null
          study_level?: Database["public"]["Enums"]["study_level"] | null
          updated_at?: string | null
          user_id?: string | null
          work_while_studying?: boolean | null
        }
        Relationships: []
      }
      destination_application_timeline: {
        Row: {
          admin_id: string | null
          created_at: string
          date: string
          destination_application_id: string
          id: string
          note: string | null
          status: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          date?: string
          destination_application_id: string
          id?: string
          note?: string | null
          status: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          date?: string
          destination_application_id?: string
          id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_application_timelin_destination_application_id_fkey"
            columns: ["destination_application_id"]
            isOneToOne: false
            referencedRelation: "destination_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_applications: {
        Row: {
          application_data: Json | null
          client_id: string
          created_at: string
          destination_id: string
          id: string
          notes: string | null
          payment_status: string
          priority: string
          program_level: string
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          application_data?: Json | null
          client_id: string
          created_at?: string
          destination_id: string
          id?: string
          notes?: string | null
          payment_status?: string
          priority?: string
          program_level: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          application_data?: Json | null
          client_id?: string
          created_at?: string
          destination_id?: string
          id?: string
          notes?: string | null
          payment_status?: string
          priority?: string
          program_level?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_applications_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_levels: {
        Row: {
          destination_id: string
          level: Database["public"]["Enums"]["program_level"]
        }
        Insert: {
          destination_id: string
          level: Database["public"]["Enums"]["program_level"]
        }
        Update: {
          destination_id?: string
          level?: Database["public"]["Enums"]["program_level"]
        }
        Relationships: [
          {
            foreignKeyName: "destination_levels_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          admission_success_rate: number | null
          agency_services: Json | null
          application_fee: number | null
          available_programs: Json | null
          bachelor_academic_level: string | null
          bachelor_documents: Json | null
          bachelor_requirements: string | null
          bachelor_tuition_max: number | null
          bachelor_tuition_min: number | null
          country: string
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          fees: number
          id: string
          image_url: string | null
          intake_periods: Json | null
          language_requirements: string | null
          logo_url: string | null
          master_academic_level: string | null
          master_documents: Json | null
          master_requirements: string | null
          master_tuition_max: number | null
          master_tuition_min: number | null
          name: string
          phd_academic_level: string | null
          phd_documents: Json | null
          phd_requirements: string | null
          phd_tuition_max: number | null
          phd_tuition_min: number | null
          procedure_type: string
          processing_time: string | null
          region: string | null
          service_fee: number | null
          status: string | null
          success_rate: number | null
          updated_at: string | null
          visa_processing_fee: number | null
          visa_requirements: string | null
          visa_success_rate: number | null
        }
        Insert: {
          admission_success_rate?: number | null
          agency_services?: Json | null
          application_fee?: number | null
          available_programs?: Json | null
          bachelor_academic_level?: string | null
          bachelor_documents?: Json | null
          bachelor_requirements?: string | null
          bachelor_tuition_max?: number | null
          bachelor_tuition_min?: number | null
          country: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          fees: number
          id?: string
          image_url?: string | null
          intake_periods?: Json | null
          language_requirements?: string | null
          logo_url?: string | null
          master_academic_level?: string | null
          master_documents?: Json | null
          master_requirements?: string | null
          master_tuition_max?: number | null
          master_tuition_min?: number | null
          name: string
          phd_academic_level?: string | null
          phd_documents?: Json | null
          phd_requirements?: string | null
          phd_tuition_max?: number | null
          phd_tuition_min?: number | null
          procedure_type?: string
          processing_time?: string | null
          region?: string | null
          service_fee?: number | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          visa_processing_fee?: number | null
          visa_requirements?: string | null
          visa_success_rate?: number | null
        }
        Update: {
          admission_success_rate?: number | null
          agency_services?: Json | null
          application_fee?: number | null
          available_programs?: Json | null
          bachelor_academic_level?: string | null
          bachelor_documents?: Json | null
          bachelor_requirements?: string | null
          bachelor_tuition_max?: number | null
          bachelor_tuition_min?: number | null
          country?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          fees?: number
          id?: string
          image_url?: string | null
          intake_periods?: Json | null
          language_requirements?: string | null
          logo_url?: string | null
          master_academic_level?: string | null
          master_documents?: Json | null
          master_requirements?: string | null
          master_tuition_max?: number | null
          master_tuition_min?: number | null
          name?: string
          phd_academic_level?: string | null
          phd_documents?: Json | null
          phd_requirements?: string | null
          phd_tuition_max?: number | null
          phd_tuition_min?: number | null
          procedure_type?: string
          processing_time?: string | null
          region?: string | null
          service_fee?: number | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          visa_processing_fee?: number | null
          visa_requirements?: string | null
          visa_success_rate?: number | null
        }
        Relationships: []
      }
      favorite_programs: {
        Row: {
          created_at: string | null
          id: string
          program_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          program_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          program_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          attachment_id: string
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          message_id: string
          thumbnail_url: string | null
        }
        Insert: {
          attachment_id?: string
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          message_id: string
          thumbnail_url?: string | null
        }
        Update: {
          attachment_id?: string
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          message_id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string | null
          message_id: string
          reaction: string
          reaction_id: string
          user_id: string
          user_type: Database["public"]["Enums"]["chat_participant_type"]
        }
        Insert: {
          created_at?: string | null
          message_id: string
          reaction: string
          reaction_id?: string
          user_id: string
          user_type: Database["public"]["Enums"]["chat_participant_type"]
        }
        Update: {
          created_at?: string | null
          message_id?: string
          reaction?: string
          reaction_id?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["chat_participant_type"]
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      notification_delivery_stats: {
        Row: {
          delivered: number
          failed: number
          notification_id: string
          read: number
        }
        Insert: {
          delivered?: number
          failed?: number
          notification_id: string
          read?: number
        }
        Update: {
          delivered?: number
          failed?: number
          notification_id?: string
          read?: number
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_stats_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: true
            referencedRelation: "notifications"
            referencedColumns: ["notification_id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          delivered_at: string | null
          is_read: boolean
          notification_id: string
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          delivered_at?: string | null
          is_read?: boolean
          notification_id: string
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          delivered_at?: string | null
          is_read?: boolean
          notification_id?: string
          recipient_id?: string
          recipient_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["notification_id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          notification_id: string
          recipient_count: number
          status: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          content: string
          created_at?: string | null
          notification_id?: string
          recipient_count?: number
          status?: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          content?: string
          created_at?: string | null
          notification_id?: string
          recipient_count?: number
          status?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      payment_receipts: {
        Row: {
          client_id: string
          id: string
          notes: string | null
          payment_id: string | null
          receipt_path: string
          status: string
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          client_id: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          receipt_path: string
          status?: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          client_id?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          receipt_path?: string
          status?: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["payment_id"]
          },
        ]
      }
      payment_verification_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          new_status: string | null
          notes: string | null
          previous_status: string | null
          secure_payment_id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          secure_payment_id: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          secure_payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_verification_log_secure_payment_id_fkey"
            columns: ["secure_payment_id"]
            isOneToOne: false
            referencedRelation: "secure_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          client_id: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          method: string
          notes: string | null
          payment_id: string
          reference: string
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          client_id: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          method: string
          notes?: string | null
          payment_id?: string
          reference: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          method?: string
          notes?: string | null
          payment_id?: string
          reference?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          permission_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          permission_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          permission_id?: string
        }
        Relationships: []
      }
      program_additional_dates: {
        Row: {
          date: string
          program_id: string
        }
        Insert: {
          date: string
          program_id: string
        }
        Update: {
          date?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_additional_dates_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_bulk_discounts: {
        Row: {
          discount_percentage: number
          min_applications: number
          program_id: string
        }
        Insert: {
          discount_percentage: number
          min_applications: number
          program_id: string
        }
        Update: {
          discount_percentage?: number
          min_applications?: number
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_bulk_discounts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_documents: {
        Row: {
          id: number
          name: string
          program_id: string
          required: boolean
        }
        Insert: {
          id?: number
          name: string
          program_id: string
          required?: boolean
        }
        Update: {
          id?: number
          name?: string
          program_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "program_documents_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_early_bird_discounts: {
        Row: {
          amount: number
          end_date: string
          program_id: string
        }
        Insert: {
          amount: number
          end_date: string
          program_id: string
        }
        Update: {
          amount?: number
          end_date?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_early_bird_discounts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_tiered_fees: {
        Row: {
          amount: number
          id: number
          program_id: string
          threshold: number
        }
        Insert: {
          amount: number
          id?: number
          program_id: string
          threshold: number
        }
        Update: {
          amount?: number
          id?: number
          program_id?: string
          threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_tiered_fees_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          academic_requirements: string | null
          admission_requirements: string
          advantages: string | null
          application_deadline: string | null
          application_fee: number | null
          application_process: string | null
          available_places: number | null
          city: string
          country: string
          created_at: string | null
          description: string
          duration_months: number
          employment_rate: number | null
          exchange_opportunities: boolean | null
          field: Database["public"]["Enums"]["program_field"]
          field_keywords: string[] | null
          gpa_requirement: number | null
          halal_food_availability: boolean | null
          housing_availability: string | null
          housing_cost_max: number | null
          housing_cost_min: number | null
          id: string
          image_url: string | null
          internship_opportunities: boolean | null
          language_requirement: Database["public"]["Enums"]["language_level"]
          language_test: string | null
          language_test_exemptions: string | null
          language_test_score: string | null
          living_cost_max: number
          living_cost_min: number
          name: string
          north_african_community_size: string | null
          program_language: string
          ranking: number | null
          religious_facilities: boolean | null
          scholarship_amount: number | null
          scholarship_available: boolean | null
          scholarship_deadline: string | null
          scholarship_details: string | null
          scholarship_requirements: string | null
          secondary_language: string | null
          status: Database["public"]["Enums"]["program_status"] | null
          study_level: Database["public"]["Enums"]["study_level"]
          success_rate: number | null
          total_places: number | null
          tuition_max: number
          tuition_min: number
          university: string
          updated_at: string | null
          video_url: string | null
          virtual_tour_url: string | null
          visa_fee: number | null
          website_url: string | null
        }
        Insert: {
          academic_requirements?: string | null
          admission_requirements: string
          advantages?: string | null
          application_deadline?: string | null
          application_fee?: number | null
          application_process?: string | null
          available_places?: number | null
          city: string
          country: string
          created_at?: string | null
          description: string
          duration_months: number
          employment_rate?: number | null
          exchange_opportunities?: boolean | null
          field: Database["public"]["Enums"]["program_field"]
          field_keywords?: string[] | null
          gpa_requirement?: number | null
          halal_food_availability?: boolean | null
          housing_availability?: string | null
          housing_cost_max?: number | null
          housing_cost_min?: number | null
          id?: string
          image_url?: string | null
          internship_opportunities?: boolean | null
          language_requirement: Database["public"]["Enums"]["language_level"]
          language_test?: string | null
          language_test_exemptions?: string | null
          language_test_score?: string | null
          living_cost_max: number
          living_cost_min: number
          name: string
          north_african_community_size?: string | null
          program_language: string
          ranking?: number | null
          religious_facilities?: boolean | null
          scholarship_amount?: number | null
          scholarship_available?: boolean | null
          scholarship_deadline?: string | null
          scholarship_details?: string | null
          scholarship_requirements?: string | null
          secondary_language?: string | null
          status?: Database["public"]["Enums"]["program_status"] | null
          study_level: Database["public"]["Enums"]["study_level"]
          success_rate?: number | null
          total_places?: number | null
          tuition_max: number
          tuition_min: number
          university: string
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          visa_fee?: number | null
          website_url?: string | null
        }
        Update: {
          academic_requirements?: string | null
          admission_requirements?: string
          advantages?: string | null
          application_deadline?: string | null
          application_fee?: number | null
          application_process?: string | null
          available_places?: number | null
          city?: string
          country?: string
          created_at?: string | null
          description?: string
          duration_months?: number
          employment_rate?: number | null
          exchange_opportunities?: boolean | null
          field?: Database["public"]["Enums"]["program_field"]
          field_keywords?: string[] | null
          gpa_requirement?: number | null
          halal_food_availability?: boolean | null
          housing_availability?: string | null
          housing_cost_max?: number | null
          housing_cost_min?: number | null
          id?: string
          image_url?: string | null
          internship_opportunities?: boolean | null
          language_requirement?: Database["public"]["Enums"]["language_level"]
          language_test?: string | null
          language_test_exemptions?: string | null
          language_test_score?: string | null
          living_cost_max?: number
          living_cost_min?: number
          name?: string
          north_african_community_size?: string | null
          program_language?: string
          ranking?: number | null
          religious_facilities?: boolean | null
          scholarship_amount?: number | null
          scholarship_available?: boolean | null
          scholarship_deadline?: string | null
          scholarship_details?: string | null
          scholarship_requirements?: string | null
          secondary_language?: string | null
          status?: Database["public"]["Enums"]["program_status"] | null
          study_level?: Database["public"]["Enums"]["study_level"]
          success_rate?: number | null
          total_places?: number | null
          tuition_max?: number
          tuition_min?: number
          university?: string
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          visa_fee?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          created_by: string
          date_range_end: string
          date_range_start: string
          file_path: string | null
          report_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date_range_end: string
          date_range_start: string
          file_path?: string | null
          report_id?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date_range_end?: string
          date_range_start?: string
          file_path?: string | null
          report_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          role_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      secure_payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string | null
          currency: string
          id: string
          item_id: string | null
          item_name: string
          item_type: string
          payment_instructions_generated: boolean | null
          payment_method: string
          payment_reference: string
          receipt_upload_path: string | null
          status: string
          updated_at: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string | null
          currency?: string
          id?: string
          item_id?: string | null
          item_name: string
          item_type: string
          payment_instructions_generated?: boolean | null
          payment_method: string
          payment_reference: string
          receipt_upload_path?: string | null
          status?: string
          updated_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          item_id?: string | null
          item_name?: string
          item_type?: string
          payment_instructions_generated?: boolean | null
          payment_method?: string
          payment_reference?: string
          receipt_upload_path?: string | null
          status?: string
          updated_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      service_applications: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          service_id: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          service_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          service_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_applications_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: number
          estimated_completion: string | null
          name: string
          price: number
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration: number
          estimated_completion?: string | null
          name: string
          price: number
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          estimated_completion?: string | null
          name?: string
          price?: number
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          description: string | null
          key: string
          setting_id: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          category: string
          description?: string | null
          key: string
          setting_id?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          key?: string
          setting_id?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_description: string | null
          activity_type: string
          ip_address: string | null
          log_id: string
          timestamp: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_program_match: {
        Args: {
          p_program_id: string
          p_study_level: Database["public"]["Enums"]["study_level"]
          p_field: string
          p_language: string
          p_budget: number
          p_living_costs?: number
          p_language_test_required?: boolean
          p_religious_facilities?: boolean
          p_halal_food?: boolean
          p_scholarship_required?: boolean
        }
        Returns: number
      }
      create_chat_history_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_client_admin_chat: {
        Args: { p_client_id: string; p_admin_id: string; p_title?: string }
        Returns: string
      }
      create_countries_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_scholarships_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_secure_payment: {
        Args: {
          p_client_id: string
          p_payment_method: string
          p_amount: number
          p_currency: string
          p_item_type: string
          p_item_id: string
          p_item_name: string
        }
        Returns: string
      }
      create_universities_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_available_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_id: string
          first_name: string
          last_name: string
          full_name: string
          photo_url: string
          status: Database["public"]["Enums"]["user_status"]
          last_active: string
        }[]
      }
      get_chat_messages: {
        Args: {
          p_chat_id: string
          p_limit?: number
          p_offset?: number
          p_before_timestamp?: string
        }
        Returns: {
          message_id: string
          sender_id: string
          sender_type: Database["public"]["Enums"]["chat_participant_type"]
          message_text: string
          sent_at: string
          status: Database["public"]["Enums"]["message_status"]
          is_edited: boolean
          reply_to_message_id: string
          message_type: Database["public"]["Enums"]["message_type"]
          attachments: Json
          reactions: Json
        }[]
      }
      get_destination_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          country: string
          total_programs: number
          avg_tuition: number
          avg_success_rate: number
          popularity_score: number
          trending_score: number
          total_applications: number
        }[]
      }
      get_match_explanation: {
        Args: {
          program_id: string
          budget_score: number
          language_score: number
          level_score: number
          location_score: number
          duration_score: number
          field_score: number
          scholarship_score: number
          cultural_score: number
        }
        Returns: string
      }
      get_matched_programs: {
        Args: {
          p_study_level: Database["public"]["Enums"]["study_level"]
          p_field: string
          p_language?: string
          p_budget?: number
          p_living_costs?: number
          p_language_test_required?: boolean
          p_religious_facilities?: boolean
          p_halal_food?: boolean
          p_scholarship_required?: boolean
          p_limit?: number
        }
        Returns: {
          program_id: string
          program_name: string
          university: string
          country: string
          city: string
          match_percentage: number
          tuition_min: number
          tuition_max: number
          living_cost_min: number
          living_cost_max: number
          program_language: string
          scholarship_available: boolean
          religious_facilities: boolean
          halal_food_availability: boolean
        }[]
      }
      get_study_fields: {
        Args: Record<PropertyKey, never>
        Returns: {
          field: string
          field_keywords: string[]
        }[]
      }
      get_user_chats: {
        Args: {
          p_user_id: string
          p_user_type: Database["public"]["Enums"]["chat_participant_type"]
        }
        Returns: {
          chat_id: string
          title: string
          is_group_chat: boolean
          last_message_text: string
          last_message_time: string
          unread_count: number
          participants: Json
        }[]
      }
      handle_ai_chat_request: {
        Args: { message_text: string; chat_history?: Json }
        Returns: {
          response: string
          error: string
        }[]
      }
      mark_messages_as_read: {
        Args: {
          p_chat_id: string
          p_participant_id: string
          p_participant_type: Database["public"]["Enums"]["chat_participant_type"]
        }
        Returns: undefined
      }
      match_programs: {
        Args: {
          p_budget: number
          p_language: string
          p_study_level: Database["public"]["Enums"]["study_level"]
          p_country: string
          p_duration: string
          p_field: string
          p_scholarship: boolean
          p_religious_facilities?: boolean
          p_halal_food?: boolean
        }
        Returns: {
          program_id: string
          match_score: number
          budget_score: number
          language_score: number
          level_score: number
          location_score: number
          duration_score: number
          field_score: number
          scholarship_score: number
          cultural_score: number
        }[]
      }
      user_can_access_chat: {
        Args: { chat_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "Draft"
        | "Submitted"
        | "In Review"
        | "Pending Documents"
        | "Approved"
        | "Rejected"
        | "Completed"
        | "Cancelled"
      appointment_mode: "In-Person" | "Online" | "Phone"
      appointment_status:
        | "Available"
        | "Reserved"
        | "Completed"
        | "Cancelled"
        | "No-Show"
      chat_participant_type: "Client" | "Admin" | "System"
      client_tier: "Basic" | "Applicant" | "Paid"
      contact_preference: "Email" | "Phone" | "Both"
      fee_type: "Fixed" | "Percentage" | "Tiered"
      language_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      message_status: "Sent" | "Delivered" | "Read" | "Failed"
      message_type: "Text" | "Image" | "File" | "System"
      notification_type:
        | "System"
        | "Application"
        | "Payment"
        | "Appointment"
        | "Document"
        | "Chat"
      payment_status:
        | "Pending"
        | "Partial"
        | "Completed"
        | "Failed"
        | "Refunded"
      priority_level: "Low" | "Medium" | "High" | "Urgent"
      program_field:
        | "Business"
        | "Engineering"
        | "Computer Science"
        | "Medicine"
        | "Law"
        | "Arts"
        | "Humanities"
        | "Social Sciences"
        | "Natural Sciences"
        | "Education"
        | "Architecture"
        | "Agriculture"
        | "Tourism"
        | "Other"
        | "Accounting"
        | "Finance"
        | "Marketing"
        | "Management"
        | "Economics"
        | "International Business"
        | "Entrepreneurship"
        | "Human Resources"
        | "Supply Chain Management"
        | "Business Analytics"
        | "Mechanical Engineering"
        | "Electrical Engineering"
        | "Civil Engineering"
        | "Chemical Engineering"
        | "Aerospace Engineering"
        | "Biomedical Engineering"
        | "Environmental Engineering"
        | "Industrial Engineering"
        | "Materials Engineering"
        | "Petroleum Engineering"
        | "Nuclear Engineering"
        | "Automotive Engineering"
        | "Information Technology"
        | "Data Science"
        | "Artificial Intelligence"
        | "Cybersecurity"
        | "Software Engineering"
        | "Network Engineering"
        | "Game Development"
        | "Web Development"
        | "Mobile Development"
        | "Dentistry"
        | "Pharmacy"
        | "Nursing"
        | "Public Health"
        | "Veterinary Medicine"
        | "Physical Therapy"
        | "Occupational Therapy"
        | "Nutrition"
        | "Medical Technology"
        | "Speech Therapy"
        | "Optometry"
        | "Radiology"
        | "Physics"
        | "Chemistry"
        | "Biology"
        | "Astronomy"
        | "Geology"
        | "Mathematics"
        | "Statistics"
        | "Environmental Science"
        | "Oceanography"
        | "Meteorology"
        | "Neuroscience"
        | "Biochemistry"
        | "Biotechnology"
        | "Genetics"
        | "Psychology"
        | "Sociology"
        | "Anthropology"
        | "Political Science"
        | "International Relations"
        | "Geography"
        | "Urban Planning"
        | "Archaeology"
        | "Criminology"
        | "Gender Studies"
        | "Ethnic Studies"
        | "Development Studies"
        | "History"
        | "Philosophy"
        | "Literature"
        | "Linguistics"
        | "Religious Studies"
        | "Cultural Studies"
        | "Classical Studies"
        | "Ethics"
        | "Comparative Literature"
        | "Fine Arts"
        | "Graphic Design"
        | "Industrial Design"
        | "Fashion Design"
        | "Interior Design"
        | "Music"
        | "Theater"
        | "Dance"
        | "Film Studies"
        | "Photography"
        | "Animation"
        | "Digital Media"
        | "Early Childhood Education"
        | "Elementary Education"
        | "Secondary Education"
        | "Special Education"
        | "Educational Leadership"
        | "Curriculum Development"
        | "Educational Psychology"
        | "Language Education"
        | "Agronomy"
        | "Horticulture"
        | "Forestry"
        | "Fisheries"
        | "Wildlife Management"
        | "Sustainable Agriculture"
        | "Food Science"
        | "Soil Science"
        | "Conservation"
        | "Journalism"
        | "Mass Communication"
        | "Public Relations"
        | "Advertising"
        | "Digital Communication"
        | "Media Studies"
        | "Broadcasting"
        | "Hospitality Management"
        | "Event Management"
        | "Culinary Arts"
        | "Hotel Management"
        | "Restaurant Management"
        | "Travel Management"
        | "Sports Management"
        | "Physical Education"
        | "Sports Science"
        | "Recreation Management"
        | "Athletic Training"
        | "Cognitive Science"
        | "Bioinformatics"
        | "Environmental Studies"
        | "Global Studies"
        | "Science and Technology Studies"
        | "Digital Humanities"
        | "Library Science"
        | "Information Science"
        | "Public Administration"
        | "Social Work"
        | "Urban Studies"
        | "Real Estate"
        | "Paralegal Studies"
        | "Nanotechnology"
        | "Robotics"
        | "Quantum Computing"
        | "Renewable Energy"
        | "Sustainable Development"
        | "Blockchain Technology"
        | "Virtual Reality"
      program_level:
        | "Undergraduate"
        | "Graduate"
        | "PhD"
        | "Certificate"
        | "Diploma"
      program_status: "Active" | "Inactive" | "Full" | "Coming Soon"
      study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma"
      user_status: "Pending" | "Active" | "Suspended" | "Inactive"
      user_type: "Admin" | "Client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "Draft",
        "Submitted",
        "In Review",
        "Pending Documents",
        "Approved",
        "Rejected",
        "Completed",
        "Cancelled",
      ],
      appointment_mode: ["In-Person", "Online", "Phone"],
      appointment_status: [
        "Available",
        "Reserved",
        "Completed",
        "Cancelled",
        "No-Show",
      ],
      chat_participant_type: ["Client", "Admin", "System"],
      client_tier: ["Basic", "Applicant", "Paid"],
      contact_preference: ["Email", "Phone", "Both"],
      fee_type: ["Fixed", "Percentage", "Tiered"],
      language_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      message_status: ["Sent", "Delivered", "Read", "Failed"],
      message_type: ["Text", "Image", "File", "System"],
      notification_type: [
        "System",
        "Application",
        "Payment",
        "Appointment",
        "Document",
        "Chat",
      ],
      payment_status: ["Pending", "Partial", "Completed", "Failed", "Refunded"],
      priority_level: ["Low", "Medium", "High", "Urgent"],
      program_field: [
        "Business",
        "Engineering",
        "Computer Science",
        "Medicine",
        "Law",
        "Arts",
        "Humanities",
        "Social Sciences",
        "Natural Sciences",
        "Education",
        "Architecture",
        "Agriculture",
        "Tourism",
        "Other",
        "Accounting",
        "Finance",
        "Marketing",
        "Management",
        "Economics",
        "International Business",
        "Entrepreneurship",
        "Human Resources",
        "Supply Chain Management",
        "Business Analytics",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Biomedical Engineering",
        "Environmental Engineering",
        "Industrial Engineering",
        "Materials Engineering",
        "Petroleum Engineering",
        "Nuclear Engineering",
        "Automotive Engineering",
        "Information Technology",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Software Engineering",
        "Network Engineering",
        "Game Development",
        "Web Development",
        "Mobile Development",
        "Dentistry",
        "Pharmacy",
        "Nursing",
        "Public Health",
        "Veterinary Medicine",
        "Physical Therapy",
        "Occupational Therapy",
        "Nutrition",
        "Medical Technology",
        "Speech Therapy",
        "Optometry",
        "Radiology",
        "Physics",
        "Chemistry",
        "Biology",
        "Astronomy",
        "Geology",
        "Mathematics",
        "Statistics",
        "Environmental Science",
        "Oceanography",
        "Meteorology",
        "Neuroscience",
        "Biochemistry",
        "Biotechnology",
        "Genetics",
        "Psychology",
        "Sociology",
        "Anthropology",
        "Political Science",
        "International Relations",
        "Geography",
        "Urban Planning",
        "Archaeology",
        "Criminology",
        "Gender Studies",
        "Ethnic Studies",
        "Development Studies",
        "History",
        "Philosophy",
        "Literature",
        "Linguistics",
        "Religious Studies",
        "Cultural Studies",
        "Classical Studies",
        "Ethics",
        "Comparative Literature",
        "Fine Arts",
        "Graphic Design",
        "Industrial Design",
        "Fashion Design",
        "Interior Design",
        "Music",
        "Theater",
        "Dance",
        "Film Studies",
        "Photography",
        "Animation",
        "Digital Media",
        "Early Childhood Education",
        "Elementary Education",
        "Secondary Education",
        "Special Education",
        "Educational Leadership",
        "Curriculum Development",
        "Educational Psychology",
        "Language Education",
        "Agronomy",
        "Horticulture",
        "Forestry",
        "Fisheries",
        "Wildlife Management",
        "Sustainable Agriculture",
        "Food Science",
        "Soil Science",
        "Conservation",
        "Journalism",
        "Mass Communication",
        "Public Relations",
        "Advertising",
        "Digital Communication",
        "Media Studies",
        "Broadcasting",
        "Hospitality Management",
        "Event Management",
        "Culinary Arts",
        "Hotel Management",
        "Restaurant Management",
        "Travel Management",
        "Sports Management",
        "Physical Education",
        "Sports Science",
        "Recreation Management",
        "Athletic Training",
        "Cognitive Science",
        "Bioinformatics",
        "Environmental Studies",
        "Global Studies",
        "Science and Technology Studies",
        "Digital Humanities",
        "Library Science",
        "Information Science",
        "Public Administration",
        "Social Work",
        "Urban Studies",
        "Real Estate",
        "Paralegal Studies",
        "Nanotechnology",
        "Robotics",
        "Quantum Computing",
        "Renewable Energy",
        "Sustainable Development",
        "Blockchain Technology",
        "Virtual Reality",
      ],
      program_level: [
        "Undergraduate",
        "Graduate",
        "PhD",
        "Certificate",
        "Diploma",
      ],
      program_status: ["Active", "Inactive", "Full", "Coming Soon"],
      study_level: ["Bachelor", "Master", "PhD", "Certificate", "Diploma"],
      user_status: ["Pending", "Active", "Suspended", "Inactive"],
      user_type: ["Admin", "Client"],
    },
  },
} as const
